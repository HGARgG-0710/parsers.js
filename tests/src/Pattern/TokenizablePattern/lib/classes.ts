import { describe } from "node:test"

import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type {
	TokenizablePattern,
	TokenizationResult
} from "../../../../../dist/src/Pattern/TokenizablePattern/interfaces.js"

import {
	ClassConstructorTest,
	ResultingAmbigiousMethodTest,
	FlushableResultingTestFlush
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
			FlushableResultingTestFlush(
				tokenizablePatternInstance,
				flushResult,
				resultCompare
			)
		}
	})
}
