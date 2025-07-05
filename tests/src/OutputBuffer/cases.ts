import { OutputBuffer } from "../../../dist/src/internal/OutputBuffer.js"
import { TestCounter } from "../lib.js"
import { TestTypes, outputBufferTest } from "./lib.js"

const outputBufferTestCounter = new TestCounter(
	([isFrozen, categoryCount]: [number, number]) =>
		`OutputBuffer (#${isFrozen}.${categoryCount})`
)

outputBufferTestCounter.test(
	[TestTypes.UNFROZEN],
	() =>
		outputBufferTest<number>().withInstance(
			new OutputBuffer().push(1, 2, 3, 4),
			function (test) {
				test.copy()
				test.freeze()
				test.get([1, 2, 3, 4])
				test.pushUnfrozen([7, 8, 9])
				test.size(4)
				test.isFrozen(false)
				test.read(1, 4, [2, 3, 4])
				test.read(0, 3, [1, 2, 3])
			}
		),
	true
)

outputBufferTestCounter.test(
	[TestTypes.FROZEN],
	function () {
		outputBufferTest<string>().withInstance(
			new OutputBuffer().push("a", "b", "c", "d", "e").freeze(),
			function (test) {
				test.copy()
				test.unfreeze()
				test.isFrozen(true)
				test.pushFrozen(["f", "g", "h", "i"])
				test.size(5)
			}
		)
	},
	true
)
