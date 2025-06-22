import { Enum } from "../../../dist/src/internal/Enum.js"
import { assertThrowing, assertThrowingFails, TestCounter } from "../lib.js"
import { enumTest, TestTypes } from "./lib.js"

const enumTestCounter = new TestCounter(
	([isStatic, categoryCount]: [number, number]) =>
		`Enum (#${isStatic}.${categoryCount})`
)

enumTestCounter.test(
	[TestTypes.INSTANCE_TEST],
	() =>
		enumTest<number>().withInstance(
			new Enum([1, 2, 3, 4, 2, 1, 5]),
			function (test) {
				test.copy()
				test.toMap((x) => x + 3, [1, 2, 3, 4, 5], [4, 5, 6, 7, 8])
				test.toMap((x) => x ** 2, [1, 2, 3, 4, 5], [1, 4, 9, 16, 25])
			}
		),
	true
)

enumTestCounter.test(
	[TestTypes.INSTANCE_TEST],
	() =>
		enumTest<string>().withInstance(
			new Enum(["a", "b", "c", "d", "e", "f"]),
			function (test) {
				test.copy()
				test.toMap(
					(x, i) => x + i,
					["a", "b", "c", "d", "e", "f"],
					["a0", "b1", "c2", "d3", "e4", "f5"]
				)
			}
		),
	true
)

enumTestCounter.test(
	[TestTypes.STATIC_TEST],
	() => {
		assertThrowing(() => Enum.assertDisjoint(new Enum([]), new Enum([])))

		assertThrowing(() =>
			Enum.assertDisjoint(
				new Enum(["1", "2", "3"]),
				new Enum(["4", "5", "6", "6"])
			)
		)

		assertThrowingFails(() =>
			Enum.assertDisjoint(
				new Enum([11, 19, 29]),
				new Enum([30, 11, 40]),
				new Enum([false, true, "str"])
			)
		)
	},
	true
)
