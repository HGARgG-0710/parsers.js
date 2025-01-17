import {
	ClassConstructorTest,
	ResultingAmbigiousMethodTest,
	FlushableResultingTestFlush,
	classTest,
	signatures
} from "lib/lib.js"

import type { EliminablePattern } from "../../../../dist/src/Eliminable/interfaces.js"

import { object, boolean, type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { T } = boolean

const isEliminable = structCheck<EliminablePattern>({
	value: T,
	result: T,
	flush: isFunction,
	eliminate: isFunction
})

const EliminableConstructorTest = ClassConstructorTest<EliminablePattern>(
	isEliminable,
	["eliminate", "flush"],
	["value", "result"]
)

const EliminableEliminateTest = ResultingAmbigiousMethodTest("eliminate")

type EliminableTestSignature = {
	input: any
	toEliminate: [any, any][]
	resultCompare: (x: any, y: any) => boolean
	flushResult: any
}

export function EliminableClassTest(
	className: string,
	eliminablePatternConstructor: new (x: any) => EliminablePattern,
	testSignatures: EliminableTestSignature[]
) {
	classTest(`(Eliminable) ${className}`, () =>
		signatures(
			testSignatures,
			({ input, toEliminate, resultCompare, flushResult }) =>
				() => {
					const instance = EliminableConstructorTest(
						eliminablePatternConstructor,
						input
					)

					// .eliminate
					for (const [eliminated, result] of toEliminate)
						EliminableEliminateTest(
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
