import type { BasicStream } from "./types/Stream/BasicStream.js"
import type { DelimPredicate } from "./parsers/ParserMap.js"
import type { DirectionalPosition, PredicatePosition } from "./types/Stream/Position.js"
import type { ReversibleStream } from "./types/Stream/ReversibleStream.js"
import { next, previous } from "./aliases.js"
import type { BoundNameType } from "./types/Stream/StreamIterationHandler.js"

import type { Summat } from "@hgargg-0710/summat.ts"
import { typeof as type } from "@hgargg-0710/one"
const { isNumber } = type

export type ChangeType = (input: ReversibleStream) => any

export const isHex = (x: string) => /^[0-9A-Fa-f]+$/.test(x)

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

export function positionStopPoint(pos: DirectionalPosition): BoundNameType {
	return isBackward(pos) ? "isStart" : "isEnd"
}
export type Indexed<Type = any> =
	| string
	| (Summat & {
			[x: number]: Type
			length: number
	  })
