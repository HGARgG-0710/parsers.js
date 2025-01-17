import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { Resulting } from "../Pattern/interfaces.js"
import type { TypePredicate } from "../interfaces.js"
import type {
	DelegateTokenizablePattern,
	FreeTokenizer,
	MethodTokenizer,
	TokenizationResult
} from "./interfaces.js"

import { FlushablePattern } from "src/Pattern/abstract.js"
import { tokenize } from "./methods.js"
import { extendPrototype } from "../utils.js"
import { tokenizeString } from "./utils.js"

import { type } from "@hgargg-0710/one"
const { isString } = type

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
): new <OutType = any>(value: Type) => DelegateTokenizablePattern<Type, InType, OutType> {
	class delegateTokenizablePattern<OutType = any>
		extends FlushableTokenizable<Type, OutType>
		implements DelegateTokenizablePattern<Type, InType, OutType>
	{
		value: Type

		tokenize: MethodTokenizer<Type, InType, OutType>
		tokenizer: FreeTokenizer<Type, InType>
		isType: TypePredicate<Type>

		constructor(value: Type) {
			super(value)
		}
	}

	extendPrototype(delegateTokenizablePattern, {
		tokenizer: { value: tokenizer },
		isType: { value: isType },
		tokenize: { value: tokenize }
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
