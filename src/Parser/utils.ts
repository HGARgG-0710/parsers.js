import type { ParsingState } from "./GeneralParser/interfaces.js"
import type { BaseParsingState } from "./interfaces.js"

import {
	iterationChoice,
	isBackward,
	predicateChoice,
	preserveDirection,
	pickDirection,
	positionStopPoint
} from "../Stream/PositionalStream/Position/utils.js"
import type { DelimPredicate, StreamHandler } from "src/Parser/ParserMap/interfaces.js"
import { positionConvert } from "src/Stream/PositionalStream/Position/utils.js"
import { type PredicatePosition } from "src/Stream/PositionalStream/Position/interfaces.js"
import type { ReversibleStream } from "src/Stream/ReversibleStream/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type {
	Position,
	PositionObject
} from "src/Stream/PositionalStream/Position/interfaces.js"
import { ArrayCollection } from "src/Pattern/Collection/classes.js"
import { type Collection } from "src/Pattern/Collection/interfaces.js"

import { function as _f, typeof as type, boolean } from "@hgargg-0710/one"
const { trivialCompose } = _f
const { isArray } = type
const { not } = boolean

export const firstFinished = function <T extends BaseParsingState = ParsingState>(
	this: T
) {
	return (this.streams as BasicStream[])[0].isEnd
}

export function delimited(
	limits: [Position, Position?] | Position,
	isdelim: DelimPredicate = () => false
) {
	if (!isArray(limits)) limits = [limits]
	const limitsDirectional = limits.map((x: Position) => positionConvert(x))
	const pred = 1 in limitsDirectional ? limitsDirectional[1] : limitsDirectional[0]
	const prePred = skip(+(1 in limits) && limits[0])

	const prev = isBackward(pred)
	const [change, endPred] = iterationChoice(pred)

	return function (input: ReversibleStream, dest: Collection = ArrayCollection()) {
		let i = 0,
			j = 0

		const skipDirection: PredicatePosition = (input: BasicStream, _j: number) =>
			isdelim(input, i, j + _j)
		skipDirection.direction = prev

		const skipDelims = skip(skipDirection)

		prePred(input)
		for (; endPred(input, i, j); ++i) {
			j += skipDelims(input)
			if (!endPred(input, i, j)) break
			dest.push(change(input))
		}

		return dest
	}
}

export function skip(steps: Position = 1) {
	const [change, endPred] = iterationChoice(positionConvert(steps))
	return function (input: ReversibleStream) {
		let i = 0
		while (endPred(input, i)) {
			change(input)
			++i
		}
		return i
	}
}

export function nested(
	inflation: StreamHandler<boolean | number>,
	deflation: StreamHandler<boolean | number>
) {
	return function (input: ReversibleStream, dest: Collection = ArrayCollection([])) {
		let depth = 1
		const depthInflate = (x: boolean | number) => x && (depth += x as number)
		const depthDeflate = (x: boolean | number) => !x || (depth -= x as number)

		for (
			let i = 0;
			!input.isEnd &&
			!!(depthInflate(inflation(input, i)) || depthDeflate(deflation(input, i)));
			++i
		)
			dest.push(input.next())

		return dest
	}
}

export const array = function (
	stream: BasicStream,
	init: Collection = ArrayCollection([])
) {
	while (!stream.isEnd) init.push(stream.next())
	return init
}

export function has(pred: Position) {
	pred = predicateChoice(positionConvert(pred))
	const stopPoint = positionStopPoint(pred)
	const checkSkip = skip(preserveDirection(pred, (x) => trivialCompose(not, x)))
	return function (input: ReversibleStream) {
		checkSkip(input)
		return !input[stopPoint]
	}
}

export function find(position: number | PositionObject) {
	position = positionConvert(position) as number
	const change = pickDirection(position)
	const stopPoint = positionStopPoint(position)
	position = Math.abs(position)
	return function (input: ReversibleStream) {
		while (!input[stopPoint] && (position as number)--) change(input)
		return input.curr
	}
}

export function merge(
	mergeRule: (streams: BasicStream[]) => number,
	endRule: (streams: BasicStream[]) => boolean,
	iterationRule: (streams: BasicStream[]) => any
) {
	return function (streams: BasicStream[], init: Collection = ArrayCollection()) {
		const final = init
		while (!endRule(streams)) {
			final.push(streams[mergeRule(streams)].curr)
			iterationRule(streams)
		}
		return final
	}
}

export function extract(pred: DelimPredicate, isRem: boolean = false) {
	return function (
		stream: BasicStream,
		destextr: Collection = ArrayCollection(),
		destrem: Collection = ArrayCollection()
	): [Collection, Collection] | Collection {
		let i = 0,
			j = 0
		do {
			while (!stream.isEnd && pred(stream, i, j)) {
				destextr.push(stream.next())
				++i
			}
			while (!stream.isEnd && !pred(stream, i, j)) {
				if (isRem) destrem.push(stream.next())
				++j
			}
		} while (!stream.isEnd)
		return isRem ? [destextr, destrem] : destextr
	}
}
