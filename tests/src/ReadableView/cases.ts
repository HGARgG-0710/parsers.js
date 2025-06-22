import { ParseableInput } from "../../../dist/src/classes.js"
import type { IReadable } from "../../../dist/src/interfaces.js"
import { ReadableView } from "../../../dist/src/internal/ReadableView.js"
import { TestCounter } from "../lib.js"
import { TestTypes, readableViewTest } from "./lib.js"

const readableViewTestCounter = new TestCounter(
	([isNonZeroOffset, categoryCount]: [number, number]) =>
		`ReadableView (#${isNonZeroOffset}.${categoryCount})`
)

class StringMockReadable implements IReadable<string> {
	read(i: number) {
		return "malice"[i]
	}
}

readableViewTestCounter.test(
	[TestTypes.ZERO_OFFSET],
	() =>
		readableViewTest<string>().withInstance(
			new ReadableView(0, new ParseableInput("abcdefghi")),
			function (test) {
				test.backward(10, 3, "d")

				test.forward(5, 2, "h")
				test.forward(1, 0, "b")

				test.initNull(3)
				test.initNull(8)

				test.initNonNull(new StringMockReadable(), 0, 1)
				test.initNonNull(new StringMockReadable(), 0, 4)

				test.read(0, 2, "ab")
				test.read(2, 7, "cdefg")
				test.read(3, 9, "defghi")
			}
		),
	true
)

class NumberMockReadable1 implements IReadable<number> {
	read(i: number) {
		return [1, 2, 3, 4, 5][i]
	}
}

class NumberMockReadable2 implements IReadable<number> {
	read(i: number) {
		return [11, 19, 77, 20, 4, 9, 99, 3][i]
	}
}

class NumberMockReadable3 implements IReadable<number> {
	read(i: number) {
		return [2, 1, 7, 10][i]
	}
}

readableViewTestCounter.test(
	[TestTypes.NON_ZERO_OFFSET],
	function () {
		readableViewTest<number>().withInstance(
			new ReadableView<number>(3, new NumberMockReadable2()),
			function (test) {
				test.backward(1, 3, 9)
				test.backward(3, 1, 19)
				test.backward(2, 5, 99)

				test.forward(2, 0, 9)
				test.forward(3, 1, 3)

				test.read(0, 4, [20, 4, 9, 99])

				test.initNull(0)
				test.initNull(6)

				test.initNonNull(new NumberMockReadable1(), 3, 1)
				test.initNonNull(new NumberMockReadable3(), 3, 0)
			}
		)
	},
	true
)
