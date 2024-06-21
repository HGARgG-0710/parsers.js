import { isArray, predicateChoice } from "../misc.js"
import type { Stream } from "../types/Stream.js"
import type { Pattern } from "../types/Pattern.js"
import type { Concattable } from "../types/Source.js"
import type { Pushable } from "./StreamParser.js"

export function delimited(
	limits: [number | Function, (number | Function)?] | (number | Function),
	isdelim: Function = () => true
) {
	if (!isArray(limits)) limits = [limits]
	const pred = predicateChoice(limits[1]) || predicateChoice(limits[0])
	const prePred = +(1 in limits) && limits[0]
	return function (input: Stream, handler: Function, init: Pushable = []) {
		skip(prePred)(input)
		const result = init
		const endpred = (input: Stream, i: number, j: number) =>
			!input.isEnd() && pred(input, i, j)
		let i = 0,
			j = 0
		const skipDelims = skip((input: Stream, _j: number) => isdelim(input, i, j + _j))
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
export function skip(steps: Function | number = 1) {
	const pred = predicateChoice(steps)
	return function (input: Stream) {
		let i = 0
		while (!input.isEnd() && pred(input, i)) {
			input.next()
			++i
		}
		return i
	}
}

export function read<Type = any>(pred: Function) {
	pred = predicateChoice(pred)
	return function (input: Stream<Type>, init: Concattable<Type>) {
		let res = init
		for (let i = 0; !input.isEnd() && pred(input, i); ++i) {
			res = res.concat(input.curr())
			input.next()
		}
		return res
	}
}

export function limit(init: number | Function, pred?: number | Function) {
	const isPred = !!pred
	pred = predicateChoice(isPred ? pred : init)
	const initSkip = skip(isPred ? predicateChoice(init) : 0)
	return function (input: Stream, initial: Pushable = []) {
		initSkip(input)
		const result = initial
		for (let i = 0; !input.isEnd() && pred(input, i); ++i) result.push(input.next())
		return result
	}
}

export const preserve = (input: Stream) => (input.isEnd() ? [] : [input.curr()])
export const miss = () => []

export function transform(handler: Function = preserve) {
	return function (input: Stream, initial: Pushable = []) {
		const result = initial
		for (let i = 0; !input.isEnd(); ++i) {
			result.push(...handler(input, i))
			input.next()
		}
		return result
	}
}

export function nested(
	inflation: (input?: Stream) => any,
	deflation: (input?: Stream) => any
) {
	return function (input: Stream) {
		let depth = 1
		const depthInflate = (x: boolean) => x && (depth += x as unknown as number)
		const depthDeflate = (x: boolean) => !x || (depth -= x as unknown as number)
		return limit(
			(input: Stream) =>
				depthInflate(!!inflation(input)) || depthDeflate(!!deflation(input))
		)(input)
	}
}
