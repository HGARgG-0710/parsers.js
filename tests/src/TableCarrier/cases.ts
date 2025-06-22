import { TableCarrier } from "../../../dist/src/modules/IndexMap/classes/LiquidMap.js"
import { TestCounter } from "../lib.js"
import { tableCarrierTest } from "./lib.js"

const tableCarrierTestCounter = new TestCounter(
	([categoryCount]: number[]) => `TableCarrier (#${categoryCount})`
)

tableCarrierTestCounter.test(
	[],
	() =>
		tableCarrierTest().withInstance(
			new TableCarrier([], []),
			function (test) {
				test.default(undefined)
				test.size(0)
				test.keys([])
				test.values([])

				test.readUnknown(-1)
				test.readUnknown(0)
				test.readUnknown(1)
				test.readUnknown(2)
			}
		),
	true
)

tableCarrierTestCounter.test(
	[],
	() => {
		const Default = 10
		tableCarrierTest<string, string, typeof Default>().withInstance(
			new TableCarrier(["a", "b", "c"], ["b", "c", "d"], Default),
			function (test) {
				test.default(Default)
				test.size(3)
				test.keys(["a", "b", "c"])
				test.values(["b", "c", "d"])

				test.readUnknown(-1)
				test.readUnknown(3)
				test.readUnknown(4)
				test.readUnknown(5)

				test.readKnown(2, "d")
				test.readKnown(1, "c")
				test.readKnown(0, "b")
			}
		)
	},
	true
)
