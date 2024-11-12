import type {
	ValidatablePattern,
	ValidationOutput
} from "../../../../dist/src/Validatable/interfaces.js"

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

const isValidatable = structCheck<ValidatablePattern>({
	value: T,
	result: T,
	flush: isFunction,
	validate: isFunction
})

const ValidatableConstructorTest = ClassConstructorTest<ValidatablePattern>(
	isValidatable,
	["validate", "flush"],
	["value", "result"]
)

const ValidatableValidateTest = ResultingAmbigiousMethodTest("validate")

type ValidatableTestSignature = {
	input: any
	flushResult: any
	resultCompare: (x: any, y: any) => boolean
	validationInput: [any, any, ValidationOutput][]
}

export function ValidatableClassTest(
	className: string,
	validatableConstructor: new (input: any) => ValidatablePattern,
	testSignatures: ValidatableTestSignature[]
) {
	classTest(`(Validatable) ${className}`, () =>
		signatures(
			testSignatures,
			({ input, flushResult, resultCompare, validationInput }) =>
				() => {
					const testValidate = () => {
						for (const [key, handler, result] of validationInput)
							ValidatableValidateTest(
								validatableInstance,
								[key, handler],
								result,
								resultCompare
							)
					}

					const validatableInstance = ValidatableConstructorTest(
						validatableConstructor,
						input
					)

					// .validate
					testValidate()

					// .flush
					FlushableResultingTestFlush(
						validatableInstance,
						flushResult,
						resultCompare
					)

					// post-flush .validate test
					testValidate()
				}
		)
	)
}
