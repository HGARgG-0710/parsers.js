import { MultiIndex } from "../../../dist/src/internal/MultiIndex.js"
import { TestCounter } from "../lib.js"
import { multiIndexTest } from "./lib.js"

const multiIndexTestCounter = new TestCounter(
	([categoryCount]: number[]) => `MultiIndex (#${categoryCount})`
)

multiIndexTestCounter.test(
	[],
	() =>
		multiIndexTest.withInstance(new MultiIndex(), function (test) {
			test.copy()
			test.levels(0)
			test.get([])
			test.sliceWhole([])

			test.sliceEnd(0, [])
			test.sliceEnd(1, [])

			test.sliceToNegative(0, -1, [])
			test.sliceToNegative(1, -1, [])

			test.sliceToPositive(0, 1, [])
			test.sliceToPositive(1, 3, [])

			test.nextLevel()
			test.prevLevel([])

			test.resizeGreaterOrEqual(0, [])
			test.resizeGreaterOrEqual(1, [0])
			test.resizeGreaterOrEqual(5, [0, 0, 0, 0, 0])

			test.clear()

			test.extend([], [])
			test.extend([1], [1])
			test.extend([1, 2, 3, 4], [1, 2, 3, 4])

			test.from([2, 2, 4, 4, 6, 6])
		}),
	true
)

multiIndexTestCounter.test(
	[],
	() =>
		multiIndexTest.withInstance(
			new MultiIndex([1, 2, 3, 4]),
			function (test) {
				test.copy()
				test.levels(4)
				test.get([1, 2, 3, 4])
				test.last(4)
				test.sliceWhole([1, 2, 3, 4])

				test.sliceEnd(0, [1, 2, 3, 4])
				test.sliceEnd(3, [4])
				test.sliceEnd(2, [3, 4])

				test.sliceToNegative(0, -1, [1, 2, 3])
				test.sliceToNegative(1, -2, [2])
				test.sliceToNegative(1, -1, [2, 3])
				test.sliceToNegative(2, -1, [3])

				test.sliceToPositive(0, 5, [1, 2, 3, 4])
				test.sliceToPositive(0, 3, [1, 2, 3])
				test.sliceToPositive(2, 3, [3])
				test.sliceToPositive(1, 3, [2, 3])

				test.nextLevel()
				test.prevLevel([1, 2, 3])

				test.resizeLesser(0, [])
				test.resizeLesser(1, [1])
				test.resizeLesser(2, [1, 2])
				test.resizeLesser(3, [1, 2, 3])

				test.resizeGreaterOrEqual(8, [1, 2, 3, 4, 0, 0, 0, 0])
				test.resizeGreaterOrEqual(6, [1, 2, 3, 4, 0, 0])
				test.resizeGreaterOrEqual(4, [1, 2, 3, 4])

				test.clear()
				test.incLast()
				test.decLast()

				test.extend([], [1, 2, 3, 4])
				test.extend([5, 6, 7], [1, 2, 3, 4, 5, 6, 7])

				test.from([])
				test.from([1, 2, 3])
				test.from([1, 1, 1, 1, 1, 1])
			}
		),
	true
)
