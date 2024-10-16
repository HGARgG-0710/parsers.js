import {
	ClassConstructorTest,
	ResultingAmbigiousMethodTest,
	FlushableResultingTestFlush,
	classTest,
	signatures
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
	testSignatures: EliminablePatternTestSignature[]
) {
	classTest(`(EliminablePattern) ${className}`, () =>
		signatures(
			testSignatures,
			({ input, toEliminate, resultCompare, flushResult }) =>
				() => {
					const instance = EliminablePatternConstructorTest(
						eliminablePatternConstructor,
						input
					)

					// .eliminate
					for (const [eliminated, result] of toEliminate)
						EliminablePatternEliminateTest(
							instance,
							[eliminated],
							result,
							resultCompare
						)

					// .flush
					FlushableResultingTestFlush(instance, flushResult, resultCompare)
				}
		)
	)
}
