import { TableMap } from "../../../dist/src/classes.js"
import { TableCarrier } from "../../../dist/src/modules/IndexMap/classes/LiquidMap.js"
import { TestCounter } from "../lib.js"
import { tableMapTest } from "./lib.js"

const tableMapTestCounter = new TestCounter(
	([categoryCount]: number[]) => `TableMap (#${categoryCount})`
)

tableMapTestCounter.test(
	[],
	() =>
		tableMapTest<string, boolean>().withInstance(
			new TableMap([], []),
			function (test) {
				test.copy()
				test.size(0)
				test.default(undefined)

				test.count("a", 0)
				test.count("b", 0)

				test.readDefault(-1)
				test.readDefault(0)
				test.readDefault(1)
				test.readDefault(2)

				test.byDefault("a")
				test.byDefault("b")
				test.byDefault("c")

				test.keyIndex("a", -1)
				test.keyIndex("b", -1)

				test.iterator([])
				test.reverse([])
				test.unique([])
				test.toCarrier(new TableCarrier([], []))

				test.fromCarrier(
					new TableCarrier(
						["a", "b", "c"],
						[true, false, true],
						undefined
					)
				)

				test.fromCarrier(
					new TableCarrier(
						["", "11", "245", "--13"],
						[false, false, false, true],
						undefined
					)
				)

				test.add(0, [["1", false]])
				test.add(2, [])
				test.add(1, [
					["--1", true],
					["1234", true],
					["4", false]
				])

				test.concat([
					["a", true],
					["b", false]
				])
				test.concat(
					new TableMap(
						["a", "b", "c", "d"],
						[true, true, false, true]
					)
				)

				test.replaceUnknown(-1, ["A", false])
				test.replaceUnknown(-2, ["B", true])
				test.replaceUnknown(1, ["C", false])
				test.replaceUnknown(2, ["D", true])
			}
		),
	true
)

tableMapTestCounter.test(
	[],
	() => {
		const Default = 111
		tableMapTest<string, number, typeof Default>().withInstance(
			new TableMap(
				["Key1", "Key02", "Key100", "K200000", "Key1"],
				[1, 2, 100, 200000, 5],
				Default
			),
			function (test) {
				test.copy()
				test.default(Default)
				test.size(5)

				test.count("Key1", 2)
				test.count("Key02", 1)
				test.count("Key100", 1)
				test.count("K200000", 1)
				test.count("NonExistent", 0)

				test.swap(0, 3)
				test.swap(1, 2)
				test.swap(4, 1)

				test.set("K200000", 1000)
				test.set("Key100", -5)
				test.set("Key02", 19)
				test.set("Key1", 11)

				test.readPair(0, ["Key1", 1])
				test.readPair(1, ["Key02", 2])
				test.readPair(2, ["Key100", 100])
				test.readPair(3, ["K200000", 200000])
				test.readPair(4, ["Key1", 5])

				test.readDefault(5)
				test.readDefault(7)
				test.readDefault(-1)

				test.rekeySame("Key1")
				test.rekeySame("Key2")

				test.rekeyToUndefined("Key1", "NewKey")
				test.rekeyToUndefined("Key02", "OtherNewKey")

				test.rekeyFromBeforeTo("Key100", "K200000")
				test.rekeyFromBeforeTo("Key1", "Key02")

				test.rekeyFromAfterTo("Key100", "Key02")
				test.rekeyFromAfterTo("K200000", "Key1")

				test.by("Key1", 1)
				test.by("Key02", 2)
				test.by("Key100", 100)
				test.by("K200000", 200000)

				test.byDefault("11")
				test.byDefault("")
				test.byDefault("NonExistent")

				test.keyIndex("Key02", 1)
				test.keyIndex("K200000", 3)
				test.keyIndex("Key100", 2)
				test.keyIndex("Key1", 0)
				test.keyIndex("NonExistent", -1)

				test.iterator([
					["Key1", 1],
					["Key02", 2],
					["Key100", 100],
					["K200000", 200000],
					["Key1", 5]
				])

				test.reverse([
					["Key1", 5],
					["K200000", 200000],
					["Key100", 100],
					["Key02", 2],
					["Key1", 1]
				])

				test.toCarrier(
					new TableCarrier(
						["Key1", "Key02", "Key100", "K200000", "Key1"],
						[1, 2, 100, 200000, 5],
						Default
					)
				)

				test.fromCarrier(new TableCarrier([], [], Default))
				test.fromCarrier(
					new TableCarrier(
						["1", "123", "1357", "1_1_8_16"],
						[10, 20, 21, 500],
						Default
					)
				)

				test.unique([
					["Key1", 1],
					["Key02", 2],
					["Key100", 100],
					["K200000", 200000]
				])

				test.concat(new TableMap(["123", "4"], [56, 7]))
				test.concat([
					["123", 7],
					["4", 56]
				])

				test.add(20, [["K", 9]])
				test.add(3, [])
				test.add(1, [
					["A", 7],
					["B", 3],
					["C", 11]
				])

				test.delete(0, 5)
				test.delete(2, 2)
				test.delete(5, 10)

				test.replaceKnown(2, ["SomeOtherKey", 2119])
				test.replaceKnown(4, ["A", -11])

				test.replaceUnknown(-1, ["0", 1])
				test.replaceUnknown(-2, ["K", 5])
				test.replaceUnknown(5, ["M6", 7])
				test.replaceUnknown(10, ["NotAddedKey", 1])
			}
		)
	},
	true
)
