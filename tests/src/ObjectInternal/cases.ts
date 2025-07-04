import { ObjectInternal } from "../../../dist/src/modules/HashMap/classes/PreMap.js"
import { TestCounter } from "../lib.js"
import { objectInternalTest } from "./lib.js"

const objectInternalTestCounter = new TestCounter(
	([categoryCount]: number[]) => `ObjectInternal (#${categoryCount})`
)

objectInternalTestCounter.test(
	[],
	() =>
		objectInternalTest<number, undefined>().withInstance(
			new ObjectInternal({}),
			function (test) {
				test.copy([])
				test.size(0)
				test.default(undefined)

				test.getDefault("A")
				test.getDefault("B")

				test.deleteNonExistent("A")
				test.deleteNonExistent("B")

				test.setNonExistent("A", 11)
				test.setNonExistent("B", 95)
			}
		),
	true
)

objectInternalTestCounter.test(
	[],
	() => {
		const Default = false
		objectInternalTest<number, typeof Default>().withInstance(
			new ObjectInternal(
				{
					A: 2,
					B: 10,
					C: 60,
					D: 15,
					E: 7,
					F: 5
				},
				Default
			),
			function (test) {
				test.copy(["A", "B", "C", "D", "E", "F"])
				test.size(6)

				test.default(Default)
				test.getDefault("S")
				test.getDefault("G")

				test.get("F", 5)
				test.get("E", 7)
				test.get("D", 15)
				test.get("C", 60)
				test.get("B", 10)
				test.get("A", 2)

				test.delete("A")
				test.delete("C")

				test.deleteNonExistent("S")
				test.deleteNonExistent("M")

				test.setNonExistent("S", 1)
				test.set("A", 3)

				test.rekeyToUndefined("A", "S")
				test.rekeySame("A")
				test.rekey("A", "B")
			}
		)
	},
	true
)
