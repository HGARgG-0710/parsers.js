import { inplace } from "@hgargg-0710/one"
const { replace } = inplace

import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { DelegateTokenizablePattern, TokenizablePattern } from "./interfaces.js"

export function delegateTokenizablePatternTokenize<
	Type = any,
	InType = any,
	OutType = any
>(
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

export function tokenizablePatternFlush(this: TokenizablePattern): void {
	this.result = []
}
