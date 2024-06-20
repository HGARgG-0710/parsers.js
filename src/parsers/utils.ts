import { isArray, predicateChoice } from "../misc.js"
import type { Stream } from "../types/Stream.js"
import type { Pattern } from "../types/Pattern.js"
import type { Concattable } from "../types/Source.js"

export function delimited(
	limits: [number | Function, (number | Function)?] | (number | Function),
	isdelim: Function = () => true
) {
	if (!isArray(limits)) limits = [limits]
	const pred = predicateChoice(limits[1]) || predicateChoice(limits[0])
	const prePred = +(1 in limits) && limits[0]
	return function (input, handler) {
		const _skip = skip(input)
		_skip(prePred)
		const result = []
		const endpred = (input, i, j) => !input.isEnd() && pred(input, i, j)
		for (let i = 0, j = 0; endpred(input, i, j); ++i) {
			j += _skip((input, _j) => isdelim(input, i, j + _j))
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
export function skip(input: Stream) {
	return function (steps: Function | number = 1) {
		let i = 0
		const pred = predicateChoice(steps)
		while (!input.isEnd() && pred(input, i)) {
			input.next()
			++i
		}
		return i
	}
}

export function read<Type = any>(pred: Function, init: Concattable<Type>) {
	pred = predicateChoice(pred)
	return function (input: Stream<Type>) {
		let res = init
		for (let i = 0; !input.isEnd() && pred(input, i); ++i) {
			res = res.concat(input.curr())
			input.next()
		}
		return res
	}
}

export function limit(init: number | Function, pred?: number | Function) {
	init = predicateChoice(init)
	if (!pred) {
		pred = init
		init = 0
	} else pred = predicateChoice(pred)
	return function (input: Stream) {
		const _skip = skip(input)
		_skip(init)
		const result = []
		for (let i = 0; !input.isEnd() && pred(input, i); ++i) result.push(input.next())
		return result
	}
}

export const preserve = (input: Stream) => (input.isEnd() ? [] : [input.curr()])
export const miss = () => []

export function transform(handler: Function = preserve) {
	return function (input: Stream) {
		const result = []
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
