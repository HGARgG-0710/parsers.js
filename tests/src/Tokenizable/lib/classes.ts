import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type {
	TokenizablePattern,
	TokenizationResult
} from "../../../../dist/src/Tokenizable/interfaces.js"

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

const isTokenizable = structCheck<TokenizablePattern>({
	value: T,
	result: T,
	flush: isFunction,
	tokenize: isFunction
})

const TokenizableConstructorTest = ClassConstructorTest(
	isTokenizable,
	["tokenize", "flush"],
	["value", "result"]
)
const TokenizableTokenizeTest =
	ResultingAmbigiousMethodTest<TokenizablePattern>("tokenize")

type TokenizableClassTestSignature<Type = any, InType = any, OutType = any> = {
	input: any
	flushResult: TokenizationResult<Type, OutType>
	resultCompare: (
		x: TokenizationResult<Type, OutType>,
		y: TokenizationResult<Type, OutType>
	) => boolean
	tableEntries: [InType, SummatFunction<any, InType, OutType>, any][]
}

export function TokenizableClassTest<Type = any, InType = any, OutType = any>(
	className: string,
	tokenizableConstructor: new (x: any) => TokenizablePattern<Type, InType, OutType>,
	testSignatures: TokenizableClassTestSignature<Type, InType, OutType>[]
) {
	classTest(`(Tokenizable) ${className}`, () =>
		signatures(
			testSignatures,
			({ input, flushResult, resultCompare, tableEntries }) =>
				() => {
					const testTokenize = () => {
						for (const [key, handler, result] of tableEntries)
							TokenizableTokenizeTest(
								tokenizableInstance,
								[key, handler],
								result,
								resultCompare
							)
					}

					const tokenizableInstance: TokenizablePattern<Type, InType, OutType> =
						TokenizableConstructorTest(tokenizableConstructor, input)

					// .tokenize
					testTokenize()

					// .flush
					FlushableResultingTestFlush(
						tokenizableInstance,
						flushResult,
						resultCompare
					)

					// testing the re-tokenizabililty post-flushing
					testTokenize()
				}
		)
	)
}
