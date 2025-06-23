import { ParseableInput } from "../../../dist/src/classes.js"
import { TestCounter } from "../lib.js"
import { EMPTY, NON_EMPTY, parseableInputTest } from "./lib.js"

const parseableInputCounter = new TestCounter(
	([isEmptyCount, categoryCount]: [number, number]) =>
		`ParseableInput (#${isEmptyCount}.${categoryCount})`
)

parseableInputCounter.test(
	[EMPTY],
	() =>
		parseableInputTest.withInstance(
			new ParseableInput(""),
			function (test) {
				test.read(0, 0, "")
				test.size(0)
			}
		),
	true
)

parseableInputCounter.test(
	[NON_EMPTY],
	() =>
		parseableInputTest.withInstance(
			new ParseableInput("abcdef"),
			function (test) {
				test.read(0, 2, "ab")
				test.read(2, 6, "cdef")
				test.read(0, 6, "abcdef")
				test.size(6)
			}
		),
	true
)
