import { array } from "@hgargg-0710/one"
import assert from "assert"
import { MapConcatenator } from "../.../../../../dist/src/internal/Enum.js"
import { TestCounter } from "../lib.js"

const mapConcatenatorTestCounter = new TestCounter(
	([categoryCount]) => `MapConcatenator.concat (#${categoryCount})`
)

mapConcatenatorTestCounter.test(
	[],
	function () {
		const finalMap = MapConcatenator.concat(
			new Map([
				[1, "A"],
				[2, "B"],
				[3, "C"]
			]),
			new Map([
				[4, "D"],
				[5, "E"]
			])
		)

		assert(array.same(finalMap.keys(), [1, 2, 3, 4, 5]))
		assert(array.same(finalMap.values(), ["A", "B", "C", "D", "E"]))
	},
	true
)

mapConcatenatorTestCounter.test(
	[],
	function () {
		const finalMap = MapConcatenator.concat(
			new Map([
				[1, "A"],
				[2, "B"],
				[3, "C"]
			]),
			new Map([
				[5, "E"],
				[2, "D"]
			]),
			new Map([
				[6, "F"],
				[3, "M"]
			])
		)

		assert(array.same(finalMap.keys(), [1, 2, 3, 5, 6]))
		assert(array.same(finalMap.values(), ["A", "D", "M", "E", "F"]))
	},
	true
)
