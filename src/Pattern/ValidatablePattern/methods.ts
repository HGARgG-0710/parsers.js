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
	if (!this.result[1].length) {
		const matched: string[] = matchString(this.value, key)
		for (let i = matched.length; i--; )
			if (!handler(matched[i])) return (this.result = [false, []])
		return (this.result = [true, matched.filter((x) => !isBoolean(x))])
	}

	for (let i = this.result.length; i--; ) {
		const tempres = ValidatableStringPattern(this.result[1][i]).validate(key, handler)
		this.result[0] = tempres[0]
		replace(this.result[1], i, ...tempres[1])
	}

	return this.result
}
