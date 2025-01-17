import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { Resulting } from "../Pattern/interfaces.js"
import type { TypePredicate } from "../interfaces.js"
import type {
	DelegateTokenizablePattern,
	FreeTokenizer,
	TokenizationResult
} from "./interfaces.js"

import { FlushablePattern } from "src/Pattern/abstract.js"
import { extendPrototype } from "../utils.js"
import { tokenizeString } from "./utils.js"

import { type } from "@hgargg-0710/one"
const { isString } = type

import { inplace } from "@hgargg-0710/one"
const { replace } = inplace

export abstract class FlushableTokenizable<Type = any, OutType = any>
	extends FlushablePattern<Type>
	implements Resulting<TokenizationResult<Type, OutType>>
{
	result: TokenizationResult<Type, OutType>
	flush(): void {
		this.result = []
	}
}

export function DelegateTokenizable<Type = any, InType = any>(
	tokenizer: FreeTokenizer<Type, InType>,
	isType: TypePredicate<Type>
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
		isType: TypePredicate<Type>

		tokenize(key: InType, handler: SummatFunction<any, Type, OutType>) {
			if (!this.result.length)
				return (this.result = this.tokenizer(this.value!, key, handler))

			for (let r = this.result.length; r--; ) {
				const current = this.result[r]
				if (this.isType(current))
					replace(this.result, r, ...this.tokenizer(current, key, handler))
			}

			return this.result
		}

		constructor(value?: Type) {
			super(value)
		}
	}

	extendPrototype(delegateTokenizablePattern, {
		tokenizer: { value: tokenizer },
		isType: { value: isType }
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
