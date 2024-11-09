import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type {
	TokenizablePattern,
	TokenizationResult
} from "../../../../../dist/src/Pattern/TokenizablePattern/interfaces.js"

import {
	ClassConstructorTest,
	ResultingAmbigiousMethodTest,
	FlushableResultingTestFlush,
	classTest,
	signatures
} from "lib/lib.js"

import { object, boolean, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { T } = boolean
const { isFunction } = type

const isTokenizablePattern = structCheck<TokenizablePattern>({
	value: T,
	result: T,
	flush: isFunction,
	tokenize: isFunction
})

const TokenizablePatternConstructorTest = ClassConstructorTest(
	isTokenizablePattern,
	["tokenize", "flush"],
	["value", "result"]
)
const TokenizablePatternTokenizeTest =
	ResultingAmbigiousMethodTest<TokenizablePattern>("tokenize")

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
	tokenizablePatternConstructor: new (x: any) => TokenizablePattern<
		Type,
		InType,
		OutType
	>,
	testSignatures: TokenizablePatternClassTestSignature<Type, InType, OutType>[]
) {
	classTest(`(TokenizablePattern) ${className}`, () =>
		signatures(
			testSignatures,
			({ input, flushResult, resultCompare, tableEntries }) =>
				() => {
					const testTokenize = () => {
						for (const [key, handler, result] of tableEntries)
							TokenizablePatternTokenizeTest(
								tokenizablePatternInstance,
								[key, handler],
								result,
								resultCompare
							)
					}

					const tokenizablePatternInstance: TokenizablePattern<
						Type,
						InType,
						OutType
					> = TokenizablePatternConstructorTest(
						tokenizablePatternConstructor,
						input
					)

					// .tokenize
					testTokenize()

					// .flush
					FlushableResultingTestFlush(
						tokenizablePatternInstance,
						flushResult,
						resultCompare
					)

					// testing the re-tokenizabililty post-flushing
					testTokenize()
				}
		)
	)
}
