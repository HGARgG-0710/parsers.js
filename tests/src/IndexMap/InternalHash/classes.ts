import {
	MapInternalHash,
	ObjectInternalHash
} from "../../../../dist/src/IndexMap/HashMap/InternalHash/classes.js"

import { InternalHashTest } from "./lib/classes.js"

// * MapInternalHash

const R = {}

InternalHashTest("MapInternalHash", MapInternalHash, [
	{
		input: [
			new Map([
				["X", 20],
				[R, 990],
				[true, 0],
				[false, null]
			] as [any, any][]),
			false
		],
		getTests: [
			[false, null],
			[R, 990],
			["X", 20],
			[77, false],
			[true, 0]
		],
		setTests: [
			["X", 10],
			[R, 90],
			[77, 2],
			[40, 11],
			["D", "N"],
			["O", "Kappa"]
		],
		deleteTests: ["X", R],
		replaceKeyTests: [
			[77, true],
			["O", "D"]
		]
	}
])

// * ObjectInternalHash

const iterator = function* () {}

InternalHashTest("ObjectInternalHash", ObjectInternalHash, [
	{
		input: [{ kor: 10, lock: 90, [Symbol.iterator]: iterator }, null],
		getTests: [
			[Symbol.iterator, iterator],
			["kor", 10],
			["lock", 90],
			["zachary", null]
		],
		setTests: [
			["mor", 2],
			[2, 40],
			["40", "kor"],
			[10, "mor"],
			["lock", "mor"],
			["Z", 90],
			["R", 20],
			["O", 2]
		],
		deleteTests: [Symbol.iterator, "Z"],
		replaceKeyTests: [
			["mor", "lock"],
			["O", "R"]
		]
	}
])
