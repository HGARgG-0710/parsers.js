import type { Summat } from "@hgargg-0710/summat.ts"
import type { StreamPredicate } from "../../../Parser/TableMap/interfaces.js"
import type { EndableStream } from "../../../Stream/StreamClass/interfaces.js"
import type { StatePatternInitMethod } from "../../StreamClass/methods/init.js"

import { LocatorStream } from "../classes.js"

export type ValidationResult = true | [false, number]

export const ValidationError = (i: number): [false, number] => [false, i]
export const ValidationSuccess = true

export function StreamValidator(
	validator: StreamPredicate,
	defaultState?: Summat
) {
	const validationStream = new (LocatorStream(
		true,
		!!defaultState
	)(validator))()
	return function <Type = any>(
		stream: EndableStream<Type>,
		state: Summat | undefined = defaultState
	): ValidationResult {
		;(validationStream.init as StatePatternInitMethod)(stream, state)
		for (const vcurr of validationStream)
			if (!vcurr) return ValidationError(validationStream.pos!)
		return ValidationSuccess
	}
}
