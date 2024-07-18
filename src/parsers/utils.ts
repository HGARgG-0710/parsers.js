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
		init: Collection = ArrayCollection()
	) {
		skip(prePred)(input)

		const endpred = (input: BasicStream, i: number, j: number) =>
			!input.isEnd() && pred(input, i, j)
		let i = 0,
			j = 0
		const skipDelims = skip((input: BasicStream, _j: number) =>
			isdelim(input, i, j + _j)
		)

		const result = init
		for (; endpred(input, i, j); ++i) {
			j += skipDelims(input)
			if (!endpred(input, i, j)) break
			result.push(...handler(input, i, j))
			input.next()
		}
		return result
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
	return function (input: BasicStream, initial: Collection = ArrayCollection()) {
		initSkip(input)
		const result = initial
		for (let i = 0; !input.isEnd() && pred(input, i); ++i) result.push(input.next())
		return result
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

export function find(pred: StreamPredicate) {
	return typeof pred === "number"
		? function (input: BasicStream) {
				let i = 0
				while (!input.isEnd() && i < pred) {
					input.next()
					++i
				}
				return input.curr()
		  }
		: function (input: BasicStream, init: Collection = ArrayCollection()) {
				const final = init
				let i = 0
				while (!input.isEnd()) {
					if (pred(input, i)) final.push(input.curr())
					input.next()
					++i
				}
				return final
		  }
}

export function revert(input: ReversibleStream, init: Collection = ArrayCollection()) {
	const final = init
	while (!input.isStart()) final.push(input.prev())
	return final
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
