import type { SummatFunction } from "@hgargg-0710/summat.ts"
import { inplace, typeof as type } from "@hgargg-0710/one"
const { replace } = inplace
const { isBoolean } = type

import { matchString, type Pattern } from "../Pattern.js"
import type { Resulting, Flushable } from "../../misc.js"

export type ValidationOutput<Type = any> = [boolean, Type[]]

export interface ValidatablePattern<Type = any, KeyType = any>
	extends Pattern<Type>,
		Resulting<ValidationOutput>,
		Flushable {
	validate(
		key: KeyType,
		handler: SummatFunction<any, Type, boolean>
	): ValidationOutput<Type>
}

export type ValidatableStringPattern = ValidatablePattern<string, RegExp | string>

export function validatableStringPatternFlush(this: ValidatableStringPattern) {
	this.result = [false, []]
}

export function validatableStringPatternValidate(
	this: ValidatableStringPattern,
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

export function ValidatableStringPattern(value: string): ValidatableStringPattern {
	return {
		value,
		result: [false, []],
		validate: validatableStringPatternValidate,
		flush: validatableStringPatternFlush
	}
}
