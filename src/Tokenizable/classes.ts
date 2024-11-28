import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { TypePredicate } from "../interfaces.js"
import type {
	DelegateTokenizablePattern,
	FreeTokenizer,
	MethodTokenizer,
	TokenizationResult
} from "./interfaces.js"

import { extendClass } from "../utils.js"
import { FlushablePattern } from "../Pattern/classes.js"
import { tokenizablePatternFlush, delegateTokenizableTokenize } from "./methods.js"
import { tokenizeString } from "./utils.js"

import { typeof as type } from "@hgargg-0710/one"
const { isString } = type

export function DelegateTokenizable<Type = any, InType = any>(
	tokenizer: FreeTokenizer<Type, InType>,
	isType: TypePredicate<Type>
): new <OutType = any>(value: Type) => DelegateTokenizablePattern<Type, InType, OutType> {
	class delegateTokenizablePattern<OutType = any>
		extends FlushablePattern<Type>
		implements DelegateTokenizablePattern<Type, InType, OutType>
	{
		value: Type
		result: TokenizationResult<Type, OutType>

		tokenize: MethodTokenizer<Type, InType, OutType>
		tokenizer: FreeTokenizer<Type, InType>
		isType: TypePredicate<Type>

		constructor(value: Type) {
			super(value)
		}
	}

	extendClass(delegateTokenizablePattern, {
		tokenizer: { value: tokenizer },
		isType: { value: isType },
		tokenize: { value: delegateTokenizableTokenize },
		flush: { value: tokenizablePatternFlush }
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
