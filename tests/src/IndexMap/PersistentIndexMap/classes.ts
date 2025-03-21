import { PersistentIndexMapClassTest } from "./lib/classes.js"
import { classes } from "../../../../dist/main.js"
import { BasicMap } from "../../../../dist/src/IndexMap/LinearIndexMap/classes.js"
import { Pointer } from "../../../../dist/src/IndexMap/classes.js"

const { PersistentIndexMap } = classes.IndexMap

// * PersistentIndexMap

const indexedF1 = function () {}

const indexes = Array.from({ length: 5 }, () => Pointer(Pointer(0)))

PersistentIndexMapClassTest("PersistentIndexMap", PersistentIndexMap, [
	{
		instance: new BasicMap(
			[
				[10, "S"],
				[true, "K"],
				[false, 0],
				[null, -15],
				["A", indexedF1]
			],
			false
		),
		getIndexTest: [
			[false, Pointer(2), indexes[2]],
			[10, Pointer(0), indexes[0]],
			[null, Pointer(3), indexes[3]],
			[true, Pointer(1), indexes[1]],
			["A", Pointer(4), indexes[4]],
			[false, Pointer(2), indexes[2]]
		],
		indexTest: [
			[false, 0],
			[10, "S"],
			[null, -15],
			[true, "K"],
			["A", indexedF1],
			[-19, false]
		],
		byIndexTest: [
			[10, false],
			[1, [true, "K"]],
			[0, [10, "S"]],
			[3, [null, -15]],
			[2, [false, 0]],
			[4, ["A", indexedF1]]
		],
		addTests: [
			[3, ["D", 17]],
			[1, ["R", 19]],
			[4, ["Par", "per"]]
		],
		deleteInds: [0, 1, 2],
		setArgs: [
			[null, "90"],
			["D", 20],
			["l", true]
		],
		uniqueTest: [
			[false, 0],
			["Par", "per"],
			["D", 20],
			[null, "90"],
			["A", indexedF1],
			["l", true]
		],
		swapIndicies: [
			[1, 5],
			[3, 0],
			[2, 4]
		],
		replaceTests: [
			[4, ["Moe", "go"]],
			[1, ["Z", "RAPH"]]
		],
		replaceKeys: [
			["Par", "Li"],
			["A", "DAR"]
		]
	}
])
