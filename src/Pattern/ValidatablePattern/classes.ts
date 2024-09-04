import type { ValidatableStringPattern } from "./interfaces.js"
import {
	validatableStringPatternValidate,
	validatableStringPatternFlush
} from "./methods.js"

export function ValidatableStringPattern(value: string): ValidatableStringPattern {
	return {
		value,
		result: [false, []],
		validate: validatableStringPatternValidate,
		flush: validatableStringPatternFlush
	}
}
