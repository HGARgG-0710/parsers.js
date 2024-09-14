import { inplace, typeof as type } from "@hgargg-0710/one"
const { replace } = inplace
const { isBoolean } = type

import type {
	ValidatableStringPattern as ValidatableStringPatternType,
	ValidationOutput
} from "./interfaces.js"
import type { SummatFunction } from "@hgargg-0710/summat.ts"
import { matchString } from "../utils.js"

import { ValidatableStringPattern } from "./classes.js"

export function validatableStringPatternFlush(this: ValidatableStringPatternType) {
	this.result = [false, []]
}

export function validatableStringPatternValidate(
	this: ValidatableStringPatternType,
	key: string | RegExp,
	handler: SummatFunction<any, string, boolean>
): ValidationOutput<string> {
	const validated = this.result[1]
	const size = validated.length

	if (!size) {
		const matched: string[] = matchString(this.value, key)
		for (let i = matched.length; i--; )
			if (!handler(matched[i])) return (this.result = [false, []])
		return (this.result = [true, matched.filter((x) => !isBoolean(x))])
	}

	for (let i = size; i--; ) {
		const tempres = ValidatableStringPattern(validated[i]).validate(key, handler)
		this.result[0] = tempres[0]
		replace(validated, i, ...tempres[1])
	}

	return this.result
}
