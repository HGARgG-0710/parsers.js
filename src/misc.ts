import type { BasicStream } from "./types/Stream/BasicStream.js"
import type { DelimPredicate } from "./parsers/ParserMap.js"
import type { DirectionalPosition, PredicatePosition } from "./types/Stream/Position.js"
import type { ReversibleStream } from "./types/Stream/ReversibleStream.js"
import { next, previous } from "./aliases.js"
import type { BoundType } from "./types/Stream/StreamEndingHandler.js"

export type ChangeType = (input: ReversibleStream) => any

export const isHex = (x: string) => /^[0-9A-Fa-f]+$/.test(x)
export const isNumber = (x: any): x is number => typeof x === "number"
export const isFunction = (x: any): x is Function => typeof x === "function"
export const isArray = (x: any): x is any[] => x instanceof Array
export const isString = (x: any): x is string => typeof x === "string"
export const isBoolean = (x: any): x is boolean => typeof x === "boolean"
export const isSymbol = (x: any): x is symbol => typeof x === "symbol"

export function predicateChoice(x: DirectionalPosition): PredicatePosition {
	if (isNumber(x)) {
		const abs = Math.abs(x)
		const result: PredicatePosition = (
			_input: BasicStream,
			i: number = 0,
			j: number = 0
		) => i + j < abs
		result.direction = x >= 0
		return result
	}
	return x
}

export function isBackward(pos: DirectionalPosition): boolean {
	return isNumber(pos) ? pos < 0 : !("direction" in pos) || pos.direction
}

export function pickDirection(pos: DirectionalPosition): ChangeType {
	return isBackward(pos) ? previous : next
}

export function endPredicate(predicate: PredicatePosition): DelimPredicate {
	const stopPoint = positionStopPoint(predicate)
	return (input: BasicStream, i: number = 0, j: number = 0) =>
		!input[stopPoint] && predicate(input, i, j)
}

export function iterationChoice(
	directional: DirectionalPosition
): [ChangeType, DelimPredicate] {
	return [pickDirection(directional), endPredicate(predicateChoice(directional))]
}

export function preserveDirection(
	init: PredicatePosition,
	transform: (x: PredicatePosition) => PredicatePosition
) {
	const transformed = transform(init)
	transformed.direction = init.direction
	return transformed
}

export function positionStopPoint(pos: DirectionalPosition): BoundType {
	return isBackward(pos) ? "isStart" : "isEnd"
}
