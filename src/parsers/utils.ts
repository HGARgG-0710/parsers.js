import { isArray, isNumber, predicateChoice } from "../misc.js"
import type {
	DelimHandler,
	DelimPredicate,
	StreamHandler,
	StreamPredicate
} from "./ParserMap.js"
import {
	isPositionObject,
	positionConvert,
	type BasicStream,
	type Position,
	type ReversibleStream
} from "../types/Stream.js"
import type { Pattern } from "../types/Pattern.js"
import { not, preserve } from "../aliases.js"
import { ArrayCollection, type Collection } from "src/types/Collection.js"

import { function as _f } from "@hgargg-0710/one"
const { trivialCompose } = _f

export function delimited(
	limits:
		| [number | DelimPredicate, (number | DelimPredicate)?]
		| (number | DelimPredicate),
	isdelim: DelimPredicate = () => false
) {
	if (!isArray(limits)) limits = [limits]
	const pred = predicateChoice(limits[1]) || predicateChoice(limits[0])
	const prePred = +(1 in limits) && limits[0]
	return function (
		input: BasicStream,
		handler: DelimHandler = preserve,
		dest: Collection = ArrayCollection()
	) {
		skip(prePred)(input)

		const endpred = (input: BasicStream, i: number, j: number) =>
			!input.isEnd() && pred(input, i, j)
		let i = 0,
			j = 0
		const skipDelims = skip((input: BasicStream, _j: number) =>
			isdelim(input, i, j + _j)
		)

		for (; endpred(input, i, j); ++i) {
			j += skipDelims(input)
			if (!endpred(input, i, j)) break
			dest.push(...handler(input, i, j))
			input.next()
		}
		return dest
	}
}
export function eliminate<Type = any, SplitType = any, MatchType = any>(
	symbols: SplitType[]
) {
	return (pattern: Pattern<Type, SplitType, MatchType>, nil = pattern.class.empty) =>
		symbols.reduce((acc, curr) => acc.split(curr).join(nil), pattern)
}
export function skip(steps: Position = 1) {
	const pred = predicateChoice(positionConvert(steps))
	return function (input: BasicStream) {
		let i = 0
		while (!input.isEnd() && pred(input, i)) {
			input.next()
			++i
		}
		return i
	}
}

export function consume(init: Position, pred?: Position) {
	const isPred = !!pred
	init = positionConvert(init)
	pred = predicateChoice(isPred ? positionConvert(pred) : init)
	const initSkip = skip(isPred ? predicateChoice(init) : 0)
	return function (input: BasicStream, dest: Collection = ArrayCollection()) {
		initSkip(input)
		for (let i = 0; !input.isEnd() && pred(input, i); ++i) dest.push(input.next())
		return dest
	}
}

export function transform(handler: StreamHandler = preserve) {
	return function (input: BasicStream, initial: Collection = ArrayCollection()) {
		const result = initial
		for (let i = 0; !input.isEnd(); ++i) {
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
	return function (input: BasicStream) {
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
	pred = positionConvert(pred)
	const checkSkip = skip(isNumber(pred) ? pred : trivialCompose(not, pred))
	return function (input: BasicStream) {
		checkSkip(input)
		return !input.isEnd()
	}
}

export function find(pred: Position) {
	pred = positionConvert(pred)
	return typeof pred === "number"
		? function (input: BasicStream) {
				let i = 0
				while (!input.isEnd() && i < pred) {
					input.next()
					++i
				}
				return input.curr()
		  }
		: function (input: BasicStream, dest: Collection = ArrayCollection()) {
				let i = 0
				while (!input.isEnd()) {
					if (pred(input, i)) dest.push(input.curr())
					input.next()
					++i
				}
				return dest
		  }
}

export function revert(input: ReversibleStream, dest: Collection = ArrayCollection()) {
	while (!input.isStart()) dest.push(input.prev())
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
			final.push(streams[mergeRule(streams)].curr())
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
		let i = 0
		let j = 0
		while (!stream.isEnd()) {
			while (!stream.isEnd() && pred(stream, i, j)) {
				destextr.push(stream.next())
				++i
			}
			while (!stream.isEnd() && !pred(stream, i, j)) {
				if (isRem) destrem.push(stream.next())
				++j
			}
		}
		return isRem ? [destextr, destrem] : destextr
	}
}

export function prolong(streams: BasicStream[], dest: Collection = ArrayCollection()) {
	for (let i = 0; i < streams.length; ++i) {
		const stream = streams[i]
		while (!stream.isEnd()) dest.push(stream.next())
	}
	return dest
}
