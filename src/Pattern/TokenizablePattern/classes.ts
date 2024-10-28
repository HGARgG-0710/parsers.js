import type { SummatFunction } from "@hgargg-0710/summat.ts"
import { FlushablePattern } from "../classes.js"

import type {
	DelegateTokenizablePattern,
	FreeTokenizer,
	MethodTokenizer,
	TokenizationResult
} from "./interfaces.js"
import { tokenizeString } from "./utils.js"
import { tokenizablePatternFlush, delegateTokenizablePatternTokenize } from "./methods.js"

import { typeof as type } from "@hgargg-0710/one"
const { isString } = type

export function DelegateTokenizablePattern<Type = any, InType = any>(
	tokenizer: FreeTokenizer<Type, InType>,
	isType: (x: any) => x is Type
): new <OutType = any>(value: Type) => DelegateTokenizablePattern<Type, InType, OutType> {
	class delegateTokenizablePattern<OutType = any>
		extends FlushablePattern<Type>
		implements DelegateTokenizablePattern<Type, InType, OutType>
	{
		tokenize: MethodTokenizer<Type, InType, OutType>
		tokenizer: FreeTokenizer<Type, InType>
		isType: (x: any) => x is Type
		result: TokenizationResult<Type, OutType>

		constructor(value: Type) {
			super(value)
		}
	}

	Object.defineProperties(delegateTokenizablePattern.prototype, {
		tokenizer: { value: tokenizer },
		isType: { value: isType },
		tokenize: { value: delegateTokenizablePatternTokenize },
		flush: { value: tokenizablePatternFlush }
	})

	return delegateTokenizablePattern
}

export const TokenizableStringPattern = DelegateTokenizablePattern<
	string,
	string | RegExp
>(
	<OutType = any>(
		current: string,
		key: string | RegExp,
		handler: SummatFunction<any, string, OutType>
	) => tokenizeString<OutType>(current, key, handler)[2],
	isString
)
