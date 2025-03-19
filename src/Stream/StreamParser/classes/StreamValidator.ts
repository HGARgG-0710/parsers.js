import type { Summat } from "@hgargg-0710/summat.ts"
import type { IStreamPredicate } from "../../../Parser/TableMap/interfaces.js"
import type { IEndableStream } from "../../../Stream/StreamClass/interfaces.js"
import type { IStatePatternInitMethod } from "../../StreamClass/methods/init.js"
import type { ValidationResult } from "../../../interfaces.js"

import { LocatorStream } from "../classes.js"

export const ValidationError = (i: number): [false, number] => [false, i]
export const ValidationSuccess = true

export function StreamValidator(
	validator: IStreamPredicate,
	defaultState?: Summat
) {
	const validationStream = new (LocatorStream(
		true,
		!!defaultState
	)(validator))()
	
	return function <Type = any>(
		stream: IEndableStream<Type>,
		state: Summat | undefined = defaultState
	): ValidationResult {
		;(validationStream.init as IStatePatternInitMethod)(stream, state)
		for (const vcurr of validationStream)
			if (!vcurr) return ValidationError(validationStream.pos!)
		return ValidationSuccess
	}
}
