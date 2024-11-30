import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { DelegateTokenizablePattern } from "./interfaces.js"

import { FlushableTokenizable } from "./classes.js"

import { inplace } from "@hgargg-0710/one"
const { replace } = inplace

export function tokenize<Type = any, InType = any, OutType = any>(
	this: DelegateTokenizablePattern<Type, InType, OutType>,
	key: InType,
	handler: SummatFunction<any, Type, OutType>
) {
	if (!this.result.length)
		return (this.result = this.tokenizer(this.value, key, handler))

	for (let r = this.result.length; r--; ) {
		const current = this.result[r]
		if (this.isType(current))
			replace(this.result, r, ...this.tokenizer(current, key, handler))
	}

	return this.result
}

export const { flush } = FlushableTokenizable.prototype
