import { LineLengths } from "../../../dist/src/classes/Position.js"
import { TestCounter } from "../lib.js"
import { lineLengthsTest } from "./lib.js"

const lineLengthsTestCounter = new TestCounter(
	([categoryCount]: number[]) => `LineLengths (#${categoryCount})`
)

lineLengthsTestCounter.test(
	[],
	() =>
		lineLengthsTest.withInstance(new LineLengths(), function (test) {
			test.isNew(0, true)
			test.isExcess(0, false)
			test.isKnown(0, false)

			test.isNew(10, false)
			test.isExcess(10, true)
			test.isKnown(10, false)
		}),
	true
)

lineLengthsTestCounter.test(
	[],
	() =>
		lineLengthsTest.withInstance(
			new LineLengths([1, 2, 3, 4, 5]),
			function (test) {
				test.copy(4)

				test.get(0, 1)
				test.get(1, 2)
				test.get(2, 3)
				test.get(3, 4)
				test.get(4, 5)

				test.slice(4, [1, 2, 3, 4])
				test.slice(3, [1, 2, 3])

				test.isAcceptable(0, 2, false)
				test.isAcceptable(0, 1, true)
				test.isAcceptable(0, 0, true)
				test.isAcceptable(4, 4, true)
				test.isAcceptable(4, 7, false)

				test.isKnown(0, true)
				test.isKnown(3, true)
				test.isKnown(4, true)
				test.isKnown(5, false)
				test.isKnown(13, false)

				test.isNew(5, true)
				test.isNew(4, false)
				test.isNew(6, false)

				test.isExcess(5, false)
				test.isExcess(6, true)
				test.isExcess(100, true)
				test.isExcess(4, false)
				test.isExcess(0, false)
			}
		),
	true
)
