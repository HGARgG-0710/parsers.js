import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type {
	ValidatableStringPattern as ValidatableStringPatternType,
	ValidationOutput
} from "./interfaces.js"
import {
	validatableStringPatternValidate,
	validatableStringPatternFlush
} from "./methods.js"
import { FlushablePattern } from "../classes.js"

export class ValidatableStringPattern
	extends FlushablePattern<string>
	implements ValidatableStringPatternType
{
	result: ValidationOutput<any>
	flush: () => void
	validate: (
		key: string | RegExp,
		handler: SummatFunction<any, string, boolean>
	) => ValidationOutput<string>

	constructor(value: string) {
		super(value)
	}
}

Object.defineProperties(ValidatableStringPattern.prototype, {
	validate: { value: validatableStringPatternValidate },
	flush: { value: validatableStringPatternFlush }
})
