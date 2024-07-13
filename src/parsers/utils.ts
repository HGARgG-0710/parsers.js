import { isArray, predicateChoice } from "../misc.js"
import type {
	DelimHandler,
	DelimPredicate,
	Handler,
	ParsingPredicate
} from "./TableParser.js"
import {
	isPosition,
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
		init: Collection = ArrayCollection([])
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
			result.append(...handler(input, i, j))
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
export function skip(steps: ParsingPredicate | number | Position = 1) {
	const pred = predicateChoice(isPosition(steps) ? steps.convert() : steps)
	return function (input: BasicStream) {
		let i = 0
		while (!input.isEnd() && pred(input, i)) {
			input.next()
			++i
		}
		return i
	}
}

export function consume(
	init: number | ParsingPredicate,
	pred?: number | ParsingPredicate
) {
	const isPred = !!pred
	pred = predicateChoice(isPred ? pred : init)
	const initSkip = skip(isPred ? predicateChoice(init) : 0)
	return function (input: BasicStream, initial: Collection = ArrayCollection([])) {
		initSkip(input)
		const result = initial
		for (let i = 0; !input.isEnd() && pred(input, i); ++i) result.append(input.next())
		return result
	}
}

export function transform(handler: Handler = preserve) {
	return function (input: BasicStream, initial: Collection = ArrayCollection([])) {
		const result = initial
		for (let i = 0; !input.isEnd(); ++i) {
			result.append(...handler(input, i))
			input.next()
		}
		return result
	}
}

export function nested(
	inflation: Handler<boolean | number>,
	deflation: Handler<boolean | number>
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

export function has(pred: ParsingPredicate) {
	const checkSkip = skip(trivialCompose(not, pred))
	return function (input: BasicStream) {
		checkSkip(input)
		return !input.isEnd()
	}
}

export function find(pred: ParsingPredicate) {
	return typeof pred === "number"
		? function (input: BasicStream) {
				let i = 0
				while (!input.isEnd() && i < pred) {
					input.next()
					++i
				}
				return input.curr()
		  }
		: function (input: BasicStream, init: Collection = ArrayCollection([])) {
				const final = init
				let i = 0
				while (!input.isEnd()) {
					if (pred(input, i)) final.append(input.curr())
					input.next()
					++i
				}
				return final
		  }
}

export function revert(input: ReversibleStream, init: Collection = ArrayCollection([])) {
	const final = init
	while (!input.isStart()) final.append(input.prev())
	return final
}
