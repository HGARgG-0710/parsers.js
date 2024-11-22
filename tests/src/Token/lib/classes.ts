import { it } from "node:test"
import assert from "node:assert"

import {
	Token,
	TokenInstance,
	SimpleTokenType
} from "../../../../dist/src/Token/classes.js"

import {
	classTest,
	inputDescribe,
	recursiveToString,
	repeat,
	signatures
} from "lib/lib.js"
import { isToken } from "../../../../dist/src/Token/utils.js"

import { object } from "@hgargg-0710/one"
const { ownKeys } = object

type TokenTestSignature = [any, any]
type TokenTypeTestSignature = [any, any[]]
type TokenInstanceTestSignature = [any, number]

export function TokenTypeTest(testSignatures: TokenTypeTestSignature[]) {
	classTest(`TokenType`, () =>
		signatures(testSignatures, ([type, values]) => () => {
			const tt = SimpleTokenType(type)
			classTest(`TokenType(${recursiveToString(type)})`, () =>
				signatures(values, (value) => () => {
					const ttInstance = new tt(value)
					assert(tt.is(ttInstance))
					assert(!ownKeys(ttInstance).includes("type"))
				})
			)
		})
	)
}

export function TokenInstanceTest(testsSignatures: TokenInstanceTestSignature[]) {
	classTest(`TokenInstance`, () =>
		signatures(testsSignatures, ([base, times]) => () => {
			classTest(`TokenInstance(${recursiveToString(base)})`, () => {
				const ti = TokenInstance(base)
				const initial = new ti()

				assert(ti.is(initial))
				assert(!ownKeys(initial).includes("type"))

				repeat(times, (i: number) => {
					it(`${i}. TokenInstance(${recursiveToString(base)})`, () => {
						const nextInstance = new ti()
						assert.notStrictEqual(initial, nextInstance)
						assert(ti.is(nextInstance))
					})
				})
			})
		})
	)
}

export function TokenTest(testsSignatures: TokenTestSignature[]) {
	classTest(`Token`, () =>
		signatures(testsSignatures, ([type, value]) => () => {
			it(`Token(${inputDescribe(type, value)})`, () =>
				assert(isToken(Token(type, value))))
		})
	)
}
