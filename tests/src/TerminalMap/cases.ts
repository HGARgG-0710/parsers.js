import { MissingArgument } from "../../../dist/main.js"
import { TerminalMap } from "../../../dist/src/classes/HashMap.js"
import { PlainMap } from "../../../dist/src/modules/HashMap/classes/PlainMap.js"
import {
	ArrayMap,
	BasicMap,
	ObjectMap
} from "../../../dist/src/samples/TerminalMap.js"
import { TestCounter } from "../lib.js"
import { terminalMapTest, TestTypes } from "./lib.js"

const terminalMapTestCounter = new TestCounter(
	([plainMapType, categoryCount]: number[]) =>
		`TerminalMap (#${plainMapType}.${categoryCount})`
)

terminalMapTestCounter.test(
	[TestTypes.PLAIN_OBJECT],
	() =>
		terminalMapTest<string, number, undefined>().withInstance(
			ObjectMap(),
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

terminalMapTestCounter.test(
	[TestTypes.PLAIN_OBJECT],
	() => {
		const Default = false
		terminalMapTest<string, number, typeof Default>().withInstance(
			ObjectMap(
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

terminalMapTestCounter.test(
	[TestTypes.PLAIN_OBJECT],
	() =>
		terminalMapTest<string, number>().withInstance(
			ObjectMap({ a: 1, b: undefined, c: 3, d: undefined }),
			function (test) {
				test.size(2)
			}
		),
	true
)

terminalMapTestCounter.test(
	[TestTypes.PLAIN_ARRAY],
	() => {
		const Default = "Missing"
		terminalMapTest<number, boolean, typeof Default>().withInstance(
			ArrayMap(MissingArgument, Default),
			function (test) {
				test.copy([])
				test.size(0)
				test.default(Default)

				test.getDefault(0)
				test.getDefault(1)
				test.getDefault(2)

				test.deleteNonExistent(0)
				test.deleteNonExistent(1)
				test.deleteNonExistent(2)

				test.setNonExistent(0, false)
				test.setNonExistent(2, true)
			}
		)
	},
	true
)

terminalMapTestCounter.test(
	[TestTypes.PLAIN_ARRAY],
	() =>
		terminalMapTest<number, string, undefined>().withInstance(
			ArrayMap([
				[0, "A"],
				[2, "C"],
				[3, "D"],
				[4, "M"]
			]),
			function (test) {
				test.copy([0, 2, 3, 4])
				test.size(4)
				test.default(undefined)

				test.getDefault(1)
				test.getDefault(5)

				test.get(4, "M")
				test.get(3, "D")
				test.get(2, "C")
				test.get(0, "A")

				test.delete(0)
				test.delete(3)

				test.deleteNonExistent(1)
				test.deleteNonExistent(6)

				test.setNonExistent(5, "S")
				test.set(2, "K")
				test.rekeyToUndefined(0, 1)
				test.rekeySame(3)
				test.rekey(4, 2)
			}
		),
	true
)

terminalMapTestCounter.test(
	[TestTypes.PLAIN_ARRAY],
	() =>
		terminalMapTest<number, string, number>().withInstance(
			ArrayMap([
				[1, "A"],
				[3, "C"],
				[5, "M"]
			]),
			function (test) {
				test.size(3)
			}
		),
	true
)

terminalMapTestCounter.test(
	[TestTypes.PLAIN_MAP],
	() =>
		terminalMapTest<number, string, undefined>().withInstance(
			BasicMap(),
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

terminalMapTestCounter.test(
	[TestTypes.PLAIN_MAP],
	() => {
		const Default = 20

		const O1 = {}
		const O2 = { a: 10 }
		const O3 = { b: 20 }

		terminalMapTest<string | object, number, typeof Default>().withInstance(
			BasicMap<string | object, number, typeof Default>(
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

terminalMapTestCounter.test(
	[TestTypes.PLAIN_MAP],
	() =>
		terminalMapTest<string, number>().withInstance(
			BasicMap([
				["a", 1],
				["b", undefined],
				["c", undefined],
				["d", undefined]
			]),
			function (test) {
				test.size(1)
			}
		),
	true
)
