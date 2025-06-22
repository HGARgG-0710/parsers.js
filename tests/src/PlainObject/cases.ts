import { PlainObject } from "../../../dist/src/modules/HashMap/classes/PlainMap.js"
import { TestCounter } from "../lib.js"
import { plainMapTest } from "../PlainMap/lib.js"

const plainObjectTestCounter = new TestCounter(
	([categoryCount]: number[]) => `PlainObject (#${categoryCount})`
)

plainObjectTestCounter.test(
	[],
	() =>
		plainMapTest<string, string>().withInstance(
			new PlainObject(),
			function (test) {
				test.write("A", "B")
				test.write("", "D")
				test.read("K", undefined)
				test.values([])
			}
		),
	true
)

plainObjectTestCounter.test(
	[],
	() =>
		plainMapTest<string, number>().withInstance(
			new PlainObject({
				A: 10,
				B: 9,
				M: undefined,
				C: 11,
				D: 8
			}),
			function (test) {
				test.copy(["A", "B", "C", "D"])

				test.read("C", 11)
				test.read("D", 8)
				test.read("B", 9)
				test.read("A", 10)
				test.read("M", undefined)
				test.read("L", undefined)

				test.write("J", 12)
				test.write("R", 3)

				test.annul("F")
				test.annul("A")

				test.values([10, 9, undefined, 11, 8])
			}
		),
	true
)
