import { describe, it } from "node:test"
import {
	Token,
	TokenInstance,
	TokenType
} from "../../../../../dist/src/Pattern/Token/classes.js"
import assert from "node:assert"

export function TokenTypeTest(instances: [any, any[]][]) {
	for (const [type, values] of instances) {
		const tt = TokenType(type)
		describe(`class: TokenType(${type.toString()})`, () => {
			for (const value of values)
				it(`TokenType(${type.toString()})(${value.toString()})`, () =>
					assert(tt.is(tt(value))))
		})
	}
}

export function TokenInstanceTest(tests: [any, number, boolean][]) {
	for (const [base, times, cached] of tests) {
		describe(`class: TokenInstance(${base.toString()})`, () => {
			const ti = TokenInstance(base, cached)
			const initial = ti()
			assert(ti.is(initial))
			let i = times
			while (i--)
				it(`${times - i}. TokenInstance(${base.toString()})`, () => {
					const nextInstance = ti()
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
