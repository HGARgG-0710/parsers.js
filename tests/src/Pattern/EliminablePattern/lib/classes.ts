import { describe } from "node:test"

import {
	ClassConstructorTest,
	ResultingAmbigiousMethodTest,
	FlushableResultingTestFlush
} from "lib/lib.js"
import type { EliminablePattern } from "../../../../../dist/src/Pattern/EliminablePattern/interfaces.js"

import { object, boolean, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { T } = boolean

const isEliminablePattern = structCheck<EliminablePattern>({
	value: T,
	result: T,
	flush: isFunction,
	eliminate: isFunction
})

const EliminablePatternConstructorTest = ClassConstructorTest<EliminablePattern>(
	isEliminablePattern,
	["eliminate", "flush"],
	["value", "result"]
)

const EliminablePatternEliminateTest = ResultingAmbigiousMethodTest("eliminate")

type EliminablePatternTestSignature = {
	input: any
	toEliminate: [any, any][]
	resultCompare: (x: any, y: any) => boolean
	flushResult: any
}

export function EliminablePatternClassTest(
	className: string,
	eliminablePatternConstructor: new (x: any) => EliminablePattern,
	instances: EliminablePatternTestSignature[]
) {
	describe(`class: (EliminablePattern) ${className}`, () => {
		for (const instance of instances) {
			const { input, toEliminate, resultCompare, flushResult } = instance

			const eliminablePatternInstance = EliminablePatternConstructorTest(
				eliminablePatternConstructor,
				input
			)

			// .eliminate
			for (const [eliminated, result] of toEliminate)
				EliminablePatternEliminateTest(
					eliminablePatternInstance,
					[eliminated],
					result,
					resultCompare
				)

			// .flush
			FlushableResultingTestFlush(
				eliminablePatternInstance,
				flushResult,
				resultCompare
			)
		}
	})
}
