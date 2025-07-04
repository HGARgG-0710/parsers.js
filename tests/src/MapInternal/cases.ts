import { MapInternal } from "../../../dist/src/modules/HashMap/classes/PreMap.js"
import { TestCounter } from "../lib.js"
import { mapInternalTest } from "./lib.js"

export const mapInternalTestCounter = new TestCounter(
	([categoryCount]: number[]) => `MapInternal (#${categoryCount})`
)

mapInternalTestCounter.test(
	[],
	() =>
		mapInternalTest<number, string, undefined>().withInstance(
			new MapInternal(),
			function (test) {
				test.copy([])
				test.size(0)
				test.default(undefined)

				test.getDefault(3)
				test.getDefault(17)

				test.deleteNonExistent(5)
				test.deleteNonExistent(7)

				test.setNonExistent(3, "a")
				test.setNonExistent(4, "b")
			}
		),
	true
)

mapInternalTestCounter.test(
	[],
	() => {
		const Default = 20

		const O1 = {}
		const O2 = { a: 10 }
		const O3 = { b: 20 }

		mapInternalTest<string | object, number, typeof Default>().withInstance(
			new MapInternal(
				[
					["A", 10],
					["B", 11],
					["C", 17],
					["D", 5],
					[O1, -1],
					[O2, 44]
				],
				Default
			),
			function (test) {
				test.copy(["A", "B", "C", "D", O1, O2])
				test.size(6)
				test.default(Default)

				test.getDefault("E")
				test.getDefault(O3)

				test.get(O2, 44)
				test.get(O1, -1)
				test.get("D", 5)
				test.get("C", 17)
				test.get("B", 11)
				test.get("A", 10)

				test.delete("A")
				test.delete("B")
				test.delete(O2)

				test.deleteNonExistent("E")
				test.deleteNonExistent(O3)

				test.setNonExistent(O3, 11)
				test.set("A", 9)
				test.rekeyToUndefined("A", "F")
				test.rekeySame("C")

				test.rekey("A", O2)
				test.rekey(O1, O2)
				test.rekey("C", "B")
				test.rekey(O2, "D")
			}
		)
	},
	true
)
