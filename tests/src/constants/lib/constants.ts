import assert from "node:assert"
import { it } from "node:test"

import { typeof as type } from "@hgargg-0710/one"
const { isNumber } = type

export function constant(constName: string, post: () => void) {
	it(`constant: ${constName}`, post)
}

function constTestBody(constVal: any, expected: any) {
	return () => assert.strictEqual(constVal, expected)
}

export function constTest(constName: string, constVal: any, expected: any) {
	constant(constName, constTestBody(constVal, expected))
}

function arrayConstTestBody(
	length: number | [number?, number?],
	freeConditions: [number, (x: any) => boolean][] = []
) {
	return function (constant: any[]) {
		if (isNumber(length)) assert.strictEqual(constant.length, length)
		else {
			const [minLength, maxLength] = length
			if (minLength) assert(constant.length >= minLength)
			if (maxLength) assert(constant.length <= maxLength)
		}

		for (const [index, condition] of freeConditions)
			assert(condition(constant[index]))
	}
}

export function arrayConstTest(
	constName: string,
	testedConstant: any[],
	length: number | [number?, number?],
	freeConditions?: [number, (x: any) => boolean][]
) {
	constant(constName, () => arrayConstTestBody(length, freeConditions)(testedConstant))
}
