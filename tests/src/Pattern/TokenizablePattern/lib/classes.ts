import { describe } from "node:test"

import type {
	TokenizablePattern,
	TokenizationResult
} from "../../../../../dist/src/Pattern/TokenizablePattern/interfaces.js"
import { isTokenizablePattern } from "../../../../../dist/src/Pattern/TokenizablePattern/utils.js"
import {
	ClassConstructorTest,
	FlushableResultableAmbigiousMethodTest,
	FlushableResultableTestFlush
} from "lib/lib.js"
import type { SummatFunction } from "@hgargg-0710/summat.ts"

const TokenizablePatternConstructorTest = ClassConstructorTest(isTokenizablePattern)
const TokenizablePatternTokenizeTest =
	FlushableResultableAmbigiousMethodTest<TokenizablePattern>("tokenize")

type TokenizablePatternClassTestSignature<Type = any, InType = any, OutType = any> = {
	input: any
	flushResult: TokenizationResult<Type, OutType>
	resultCompare: (
		x: TokenizationResult<Type, OutType>,
		y: TokenizationResult<Type, OutType>
	) => boolean
	tableEntries: [InType, SummatFunction<any, InType, OutType>, any][]
}

export function TokenizablePatternClassTest<Type = any, InType = any, OutType = any>(
	className: string,
	tokenizablePatternConstructor: (x: any) => TokenizablePattern<Type, InType, OutType>,
	instances: TokenizablePatternClassTestSignature<Type, InType, OutType>[]
) {
	describe(`class: (TokenizablePattern) ${className}`, () => {
		for (const instance of instances) {
			const { input, flushResult, resultCompare, tableEntries } = instance
			const tokenizablePatternInstance: TokenizablePattern<Type, InType, OutType> =
				TokenizablePatternConstructorTest(tokenizablePatternConstructor, input)

			// .tokenize
			for (const [key, handler, result] of tableEntries)
				TokenizablePatternTokenizeTest(
					tokenizablePatternInstance,
					[key, handler],
					result,
					resultCompare
				)

			// .flush
			FlushableResultableTestFlush(
				tokenizablePatternInstance,
				flushResult,
				resultCompare
			)
		}
	})
}
