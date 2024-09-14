import { describe } from "node:test"

import { isEliminablePattern } from "../../../../../dist/src/Pattern/EliminablePattern/utils.js"
import {
	ClassConstructorTest,
	FlushableResultableAmbigiousMethodTest,
	FlushableResultableTestFlush
} from "lib/lib.js"
import type { EliminablePattern } from "../../../../../dist/src/Pattern/EliminablePattern/interfaces.js"

const EliminablePatternConstructorTest =
	ClassConstructorTest<EliminablePattern>(isEliminablePattern)

const EliminablePatternEliminateTest = FlushableResultableAmbigiousMethodTest("eliminate")

type EliminablePatternTestSignature = {
	input: any
	toEliminate: [any, any][]
	resultCompare: (x: any, y: any) => boolean
	flushResult: any
}

export function EliminablePatternClassTest(
	className: string,
	eliminablePatternConstructor: (x: any) => EliminablePattern,
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
			FlushableResultableTestFlush(
				eliminablePatternInstance,
				flushResult,
				resultCompare
			)
		}
	})
}
