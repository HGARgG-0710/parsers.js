import { ParseableInput } from "../../../dist/src/classes.js"
import { TestCounter } from "../lib.js"
import { TestTypes, parseableInputTest } from "./lib.js"

const parseableInputTestCounter = new TestCounter(
	([isEmptyCount, categoryCount]: [number, number]) =>
		`ParseableInput (#${isEmptyCount}.${categoryCount})`
)

parseableInputTestCounter.test(
	[TestTypes.EMPTY],
	() =>
		parseableInputTest.withInstance(
			new ParseableInput(""),
			function (test) {
				test.copy()
				test.read(0, 0, "")
				test.size(0)
			}
		),
	true
)

parseableInputTestCounter.test(
	[TestTypes.NON_EMPTY],
	() =>
		parseableInputTest.withInstance(
			new ParseableInput("abcdef"),
			function (test) {
				test.copy()
				test.read(0, 2, "ab")
				test.read(2, 6, "cdef")
				test.read(0, 6, "abcdef")
				test.size(6)
			}
		),
	true
)
