import { PlainMap } from "../../../dist/src/modules/HashMap/classes/PlainMap.js"
import { TestCounter } from "../lib.js"
import { plainMapTest } from "./lib.js"

const plainMapTestCounter = new TestCounter(
	([categoryCount]: number[]) => `PlainMap (#${categoryCount})`
)

plainMapTestCounter.test(
	[],
	() =>
		plainMapTest<string, number>().withInstance(
			new PlainMap(),
			function (test) {
				test.write("A", 10)
				test.write("B", 11)
				test.read("A", undefined)
				test.values([])
			}
		),
	true
)

plainMapTestCounter.test(
	[],
	() =>
		plainMapTest<number, string>().withInstance(
			new PlainMap(
				new Map([
					[10, "A"],
					[6, "C"],
					[5, undefined],
					[4, "K"]
				])
			),
			function (test) {
				test.copy([10, 6, 5, 4])

				test.read(6, "C")
				test.read(4, "K")
				test.read(5, undefined)
				test.read(10, "A")
				test.read(111, undefined)

				test.write(5, "11")
				test.write(7, "X")

				test.annul(10)
				test.annul(7)
				test.annul(5)

				test.values(["A", "C", undefined, "K"])
			}
		),
	true
)
