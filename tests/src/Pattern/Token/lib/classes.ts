import { describe, it } from "node:test"
import assert from "node:assert"

import {
	Token,
	TokenInstance,
	SimpleTokenType
} from "../../../../../dist/src/Pattern/Token/classes.js"

import { object } from "@hgargg-0710/one"
const { ownKeys } = object

export function TokenTypeTest(instances: [any, any[]][]) {
	for (const [type, values] of instances) {
		const tt = SimpleTokenType(type)
		describe(`class: TokenType(${type.toString()})`, () => {
			for (const value of values)
				it(`TokenType(${type.toString()})(${value.toString()})`, () => {
					const ttInstance = new tt(value)
					assert(tt.is(ttInstance))
					assert(!ownKeys(ttInstance).includes("type"))
				})
		})
	}
}

export function TokenInstanceTest(tests: [any, number, boolean][]) {
	for (const [base, times] of tests) {
		describe(`class: TokenInstance(${base.toString()})`, () => {
			const ti = TokenInstance(base)
			const initial = new ti()

			assert(ti.is(initial))
			assert(!ownKeys(initial).includes("type"))

			let i = times
			while (i--)
				it(`${times - i}. TokenInstance(${base.toString()})`, () => {
					const nextInstance = new ti()
					assert.notStrictEqual(initial, nextInstance)
					assert(ti.is(nextInstance))
				})
		})
	}
}

export function TokenTest(instances: [any, any][]) {
	describe("class: Token", () => {
		for (const [type, value] of instances)
			it(`Token(${(type.toString(), value.toString())})`, () =>
				assert(Token.is(Token(type, value))))
	})
}
