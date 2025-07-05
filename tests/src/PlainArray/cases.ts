import { PlainArray } from "../../../dist/src/modules/HashMap/classes/PlainMap.js"
import { Pairs } from "../../../dist/src/samples.js"
import { TestCounter } from "../lib.js"
import { plainMapTest } from "../PlainMap/lib.js"

const plainArrayTestCounter = new TestCounter(
	([categoryCount]: number[]) => `PlainArray (#${categoryCount})`
)

plainArrayTestCounter.test(
	[],
	() =>
		plainMapTest<number, number>().withInstance(
			new PlainArray(),
			function (test) {
				test.write(1, 5)
				test.write(0, 6)
				test.write(3, -11)

				test.read(1, undefined)
				test.read(2, undefined)

				test.values([])
			}
		),
	true
)

plainArrayTestCounter.test(
	[],
	() =>
		plainMapTest<number, string>().withInstance(
			new PlainArray(
				Pairs.toArray([
					[0, "A"],
					[3, "B"],
					[5, "C"]
				])
			),
			function (test) {
				test.copy([0, 3, 5])

				test.write(1, "D")
				test.write(3, "M")
				test.write(7, "A")

				test.annul(0)
				test.annul(1)
				test.annul(5)

				test.read(1, undefined)
				test.read(0, "A")
				test.read(5, "C")
				test.read(3, "B")

				test.values(["A", undefined, undefined, "B", undefined, "C"])
			}
		),
	true
)
