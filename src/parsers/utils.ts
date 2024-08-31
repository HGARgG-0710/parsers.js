import {
	iterationChoice,
	isBackward,
	predicateChoice,
	preserveDirection,
	pickDirection,
	positionStopPoint
} from "../misc.js"
import type { DelimPredicate, StreamHandler } from "./ParserMap.js"
import { positionConvert, type PredicatePosition } from "../types/Stream/Position.js"
import type { ReversibleStream } from "../types/Stream/ReversibleStream.js"
import type { BasicStream } from "../types/Stream/BasicStream.js"
import type { Position } from "../types/Stream/Position.js"
import { preserve } from "../aliases.js"
import { ArrayCollection, type Collection } from "../types/Collection.js"

import { function as _f, typeof as type, boolean } from "@hgargg-0710/one"
const { trivialCompose } = _f
const { isArray, isNumber } = type
const { not } = boolean

export function delimited(
	limits: [Position, Position?] | Position,
	isdelim: DelimPredicate = () => false
) {
	if (!isArray(limits)) limits = [limits]
	const limitsDirectional = limits.map((x) => positionConvert(x))
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

export function consume(init: Position, pred?: Position) {
	const isPred = !!pred
	init = positionConvert(init)
	const directional = isPred ? positionConvert(pred) : init

	const initSkip = skip(+isPred && predicateChoice(init))
	const [change, endPred] = iterationChoice(directional)

	return function (input: ReversibleStream, dest: Collection = ArrayCollection()) {
		initSkip(input)
		for (let i = 0; endPred(input, i); ++i) dest.push(change(input))
		return dest
	}
}

export function transform(handler: StreamHandler = preserve) {
	return function (input: BasicStream, initial: Collection = ArrayCollection()) {
		const result = initial
		for (let i = 0; !input.isEnd; ++i) {
			result.push(...handler(input, i))
			input.next()
		}
		return result
	}
}

export function nested(
	inflation: StreamHandler<boolean | number>,
	deflation: StreamHandler<boolean | number>
) {
	return function (input: ReversibleStream) {
		let depth = 1
		const depthInflate = (x: boolean | number) => x && (depth += x as number)
		const depthDeflate = (x: boolean | number) => !x || (depth -= x as number)
		return consume(
			(input: BasicStream, i: number) =>
				!!(depthInflate(inflation(input, i)) || depthDeflate(deflation(input, i)))
		)(input)
	}
}

export const array = transform()

export function has(pred: Position) {
	pred = predicateChoice(positionConvert(pred))
	const stopPoint = positionStopPoint(pred)
	const checkSkip = skip(preserveDirection(pred, (x) => trivialCompose(not, x)))
	return function (input: ReversibleStream) {
		checkSkip(input)
		return !input[stopPoint]
	}
}

export function find(pred: Position) {
	pred = positionConvert(pred)
	const change = pickDirection(pred)
	const stopPoint = positionStopPoint(pred)
	pred = isNumber(pred) ? Math.abs(pred) : pred
	return isNumber(pred)
		? function (input: ReversibleStream) {
				while (!input[stopPoint] && (pred as number)--) change(input)
				return input.curr
		  }
		: function (input: ReversibleStream, dest: Collection = ArrayCollection()) {
				let i = 0,
					j = 0
				for (; !input[stopPoint]; change(input)) {
					if (pred(input, i, j)) {
						dest.push(input.curr)
						++j
						continue
					}
					++i
				}
				return dest
		  }
}

export function revert(input: ReversibleStream, dest: Collection = ArrayCollection()) {
	while (!input.isStart) dest.push(input.prev())
	return dest
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

export function prolong(streams: BasicStream[], dest: Collection = ArrayCollection()) {
	const streamLen = streams.length - 1
	let i = streams.length
	while (i--) {
		const stream = streams[streamLen - i]
		while (!stream.isEnd) dest.push(stream.next())
	}
	return dest
}
