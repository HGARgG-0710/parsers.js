import { describe } from "node:test"

import {
	ClassConstructorTest,
	FlushableResultableAmbigiousMethodTest,
	FlushableResultableTestFlush
} from "lib/lib.js"
import { isValidatablePattern } from "../../../../../dist/src/Pattern/ValidatablePattern/utils.js"
import type { ValidatablePattern } from "../../../../../dist/src/Pattern/ValidatablePattern/interfaces.js"

const ValidatablePatternConstructorTest =
	ClassConstructorTest<ValidatablePattern>(isValidatablePattern)
const ValidatablePatternValidateTest = FlushableResultableAmbigiousMethodTest("validate")

type ValidatablePatternTestSignature = {
	input: any
	flushResult: any
	resultCompare: (x: any, y: any) => boolean
	validationInput: [any, any, any][]
}

export function ValidatablePatternClassTest(
	className: string,
	validatablePatternConstructor: (input: any) => ValidatablePattern,
	instances: ValidatablePatternTestSignature[]
) {
	describe(`class: (ValidatablePattern) ${className}`, () => {
		for (const instance of instances) {
			const { input, flushResult, resultCompare, validationInput } = instance
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
			FlushableResultableTestFlush(
				validatablePatternInstance,
				flushResult,
				resultCompare
			)
		}
	})
}
