import type { ValidatablePattern } from "../../../../../dist/src/Pattern/ValidatablePattern/interfaces.js"
import {
	ClassConstructorTest,
	ResultingAmbigiousMethodTest,
	FlushableResultingTestFlush,
	classTest,
	signatures
} from "lib/lib.js"

import { object, boolean, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { T } = boolean

const isValidatablePattern = structCheck<ValidatablePattern>({
	value: T,
	result: T,
	flush: isFunction,
	validate: isFunction
})

const ValidatablePatternConstructorTest = ClassConstructorTest<ValidatablePattern>(
	isValidatablePattern,
	["validate", "flush"],
	["value", "result"]
)

const ValidatablePatternValidateTest = ResultingAmbigiousMethodTest("validate")

type ValidatablePatternTestSignature = {
	input: any
	flushResult: any
	resultCompare: (x: any, y: any) => boolean
	validationInput: [any, any, any][]
}

export function ValidatablePatternClassTest(
	className: string,
	validatablePatternConstructor: new (input: any) => ValidatablePattern,
	testSignatures: ValidatablePatternTestSignature[]
) {
	classTest(`(ValidatablePattern) ${className}`, () =>
		signatures(
			testSignatures,
			({ input, flushResult, resultCompare, validationInput }) =>
				() => {
					const validatablePatternInstance = ValidatablePatternConstructorTest(
						validatablePatternConstructor,
						input
					)

					// .validate
					for (const [key, handler, result] of validationInput)
						ValidatablePatternValidateTest(
							validatablePatternInstance,
							[key, handler],
							result,
							resultCompare
						)

					// .flush
					FlushableResultingTestFlush(
						validatablePatternInstance,
						flushResult,
						resultCompare
					)
				}
		)
	)
}
