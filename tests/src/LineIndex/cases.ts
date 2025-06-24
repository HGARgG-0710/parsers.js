import { LineIndex } from "../../../dist/src/classes/Position.js"
import { TestCounter } from "../lib.js"
import { lineIndexTest } from "./lib.js"

const lineIndexTestCounter = new TestCounter(
	([categoryCounter]: [number]) => `LineIndex (#${categoryCounter})`
)

lineIndexTestCounter.test(
	[],
	() =>
		lineIndexTest.withInstance(new LineIndex(), function (test) {
			test.copy()
			test.line(0)
			test.char(0)
			test.nextChar()
			test.nextLine()
		}),
	true
)

lineIndexTestCounter.test(
	[],
	() =>
		lineIndexTest.withInstance(new LineIndex(5, 9), function (test) {
			test.copy()
			test.line(5)
			test.char(9)
			test.nextChar()
			test.nextLine()
		}),
	true
)
