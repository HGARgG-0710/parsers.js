import type { Summat } from "@hgargg-0710/summat.ts"
import type { IStreamPredicate } from "../../../TableMap/interfaces.js"
import type { IEndableStream, IPosition } from "src/Stream/interfaces.js"
import type { IStreamClassStatePatternInitMethod } from "../../StreamClass/methods/init.js"
import type { IValidationResult } from "../../../interfaces.js"

import { LocatorStream } from "../classes.js"

export const ValidationError = (i: IPosition): [false, IPosition] => [false, i]
export const ValidationSuccess = true

export function StreamValidator<Type = any>(
	validator: IStreamPredicate<Type>,
	defaultState?: Summat
) {
	const validationStream = new (LocatorStream<Type>(
		true,
		!!defaultState
	)(validator))()

	return function (
		stream: IEndableStream<Type>,
		state: Summat | undefined = defaultState
	): IValidationResult {
		;(validationStream.init as IStreamClassStatePatternInitMethod)(
			stream,
			state
		)
		for (const vcurr of validationStream)
			if (!vcurr) return ValidationError(validationStream.pos!)
		return ValidationSuccess
	}
}
