import type { type as types } from "@hgargg-0710/one"

import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { DelegateTokenizablePattern, FreeTokenizer } from "./interfaces.js"

import { FlushableTokenizable } from "./abstract.js"
import { extendPrototype } from "src/refactor.js"
import { tokenizeString } from "./utils.js"

import { type, inplace } from "@hgargg-0710/one"
const { isString } = type
const { replace } = inplace

export function DelegateTokenizable<Type = any, InType = any>(
	tokenizer: FreeTokenizer<Type, InType>,
	isType: types.TypePredicate<Type>
): new <OutType = any>(value?: Type) => DelegateTokenizablePattern<
	Type,
	InType,
	OutType
> {
	class delegateTokenizablePattern<OutType = any>
		extends FlushableTokenizable<Type, OutType>
		implements DelegateTokenizablePattern<Type, InType, OutType>
	{
		tokenizer: FreeTokenizer<Type, InType>

		tokenize(key: InType, handler: SummatFunction<any, Type, OutType>) {
			if (!this.result.length)
				return (this.result = this.tokenizer(this.value!, key, handler))

			for (let r = this.result.length; r--; ) {
				const current = this.result[r]
				if (isType(current))
					replace(this.result, r, ...this.tokenizer(current, key, handler))
			}

			return this.result
		}

		constructor(value?: Type) {
			super(value)
		}
	}

	extendPrototype(delegateTokenizablePattern, {
		tokenizer: { value: tokenizer }
	})

	return delegateTokenizablePattern
}

export const TokenizableString = DelegateTokenizable<string, string | RegExp>(
	<OutType = any>(
		current: string,
		key: string | RegExp,
		handler: SummatFunction<any, string, OutType>
	) => tokenizeString<OutType>(current, key, handler)[2],
	isString
)
