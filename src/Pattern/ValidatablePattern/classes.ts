import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type {
	ValidatableStringPattern as ValidatableStringPatternType,
	ValidationOutput
} from "./interfaces.js"
import {
	validatableStringPatternValidate,
	validatableStringPatternFlush
} from "./methods.js"

export class ValidatableStringPattern implements ValidatableStringPatternType {
	value: string
	result: ValidationOutput<any>

	flush: () => void
	validate: (
		key: string | RegExp,
		handler: SummatFunction<any, string, boolean>
	) => ValidationOutput<string>

	constructor(value: string) {
		this.value = value
		this.result = [false, []]
	}
}

Object.defineProperties(ValidatableStringPattern.prototype, {
	validate: { value: validatableStringPatternValidate },
	flush: { value: validatableStringPatternFlush }
})
