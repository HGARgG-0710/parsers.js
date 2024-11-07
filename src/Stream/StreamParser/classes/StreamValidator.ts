import type { Summat } from "@hgargg-0710/summat.ts"
import type { StreamPredicate } from "src/Parser/TableMap/interfaces.js"
import type { EndableStream } from "src/Stream/StreamClass/interfaces.js"
import type {
	ValidationError,
	ValidationResult,
	ValidationSuccess
} from "src/Parser/PatternValidator/interfaces.js"

import { validation } from "src/constants.js"
const { ValidationSuccess } = validation
const { ValidationError } = validation.PatternValidator

import { LocatorStream } from "../classes.js"

export function StreamValidator(validator: StreamPredicate, defaultState?: Summat) {
	const ValidatorStreamBase = LocatorStream(validator, true, !!defaultState)
	const validationStream = new ValidatorStreamBase()
	return function <Type = any>(
		stream: EndableStream<Type>,
		state: Summat | undefined = defaultState
	): ValidationResult {
		validationStream.init(stream, state)
		while (!validationStream.isEnd) {
			if (!validationStream.curr) return ValidationError(validationStream.pos)
			validationStream.next()
		}
		return ValidationSuccess
	}
}
