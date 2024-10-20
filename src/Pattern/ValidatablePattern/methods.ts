import type { SummatFunction } from "@hgargg-0710/summat.ts"
import { inplace } from "@hgargg-0710/one"
const { replace } = inplace

import type {
	ValidatableStringPattern as ValidatableStringPatternType,
	ValidationOutput
} from "./interfaces.js"

import { ValidatablePattern } from "src/constants.js"
import { validateString } from "./utils.js"

const { ValidationFailed } = ValidatablePattern

export function validatableStringPatternFlush(this: ValidatableStringPatternType) {
	this.result = ValidationFailed([])
}

export function validatableStringPatternValidate(
	this: ValidatableStringPatternType,
	key: string | RegExp,
	handler: SummatFunction<any, string, boolean>
): ValidationOutput<string> {
	const validated = this.result[1]
	if (!validated.length) return (this.result = validateString(this.value, key, handler))

	let tempValid = this.result[0]
	let tempRemains: any[] | null = null
	for (let i = validated.length; tempValid && i--; ) {
		;[tempValid, tempRemains] = validateString(validated[i] as string, key, handler)
		this.result[0] = tempValid
		replace(validated, i, ...tempRemains)
	}

	return this.result
}
