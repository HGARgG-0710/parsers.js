import type { SummatFunction } from "@hgargg-0710/summat.ts"

import type {
	DelegateValidatablePattern,
	InvalidMatch,
	ValidMatch
} from "./interfaces.js"

import { FlushableValidatable } from "./classes.js"

import { inplace } from "@hgargg-0710/one"
const { replace } = inplace

export const { flush } = FlushableValidatable.prototype

export function validate<Type = any, KeyType = any>(
	this: DelegateValidatablePattern<Type, KeyType>,
	key: KeyType,
	handler: SummatFunction<any, Type, ValidMatch | InvalidMatch>
) {
	const [, validated] = this.result
	if (!validated.length) return (this.result = this.validator(this.value, key, handler))

	let [tempValid] = this.result
	let tempRemains: any[] | null = null
	let i = validated.length

	while (i--) {
		;[tempValid, tempRemains] = this.validator(validated[i] as Type, key, handler)
		this.result[0] = tempValid
		replace(validated, i, ...tempRemains)
	}

	return this.result
}
