import type { SummatFunction } from "@hgargg-0710/summat.ts"
import { inplace } from "@hgargg-0710/one"
const { replace } = inplace

import type {
	DelegateValidatablePattern,
	InvalidMatch,
	ValidatableStringPattern as ValidatableStringPatternType,
	ValidMatch
} from "./interfaces.js"

import { ValidatablePattern } from "src/constants.js"

const { ValidationFailed } = ValidatablePattern

// * Note: due to the way this is defined, for validity analysis, it's better to use 'analyzeValidity' util than just '!!this.result[0]':
// * 		it returns an empty array both when '!.result[1].length' and when '!!result[0]';
export function validatablePatternFlush(this: ValidatableStringPatternType) {
	this.result = ValidationFailed([])
}

export function delegateValidatablePatternValidate<Type = any, KeyType = any>(
	this: DelegateValidatablePattern<Type, KeyType>,
	key: KeyType,
	handler: SummatFunction<any, Type, ValidMatch | InvalidMatch>
) {
	const validated = this.result[1]
	if (!validated.length) return (this.result = this.validator(this.value, key, handler))

	let tempValid = this.result[0]
	let tempRemains: any[] | null = null
	for (let i = validated.length; tempValid && i--; ) {
		;[tempValid, tempRemains] = this.validator(validated[i] as Type, key, handler)
		this.result[0] = tempValid
		replace(validated, i, ...tempRemains)
	}

	return this.result
}
