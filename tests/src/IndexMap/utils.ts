import { BasicMap } from "../../../dist/src/IndexMap/LinearIndexMap/classes.js"
import {
	fromPairsTest,
	toPairsTest,
	linearPairsTest,
	tableTest
} from "./lib/utils.js"

const tableEntries = [
	[10, 90],
	["S", 40],
	[true, null]
] as [any, any][]

const tableKV = [
	[10, "S", true],
	[90, 40, null]
]

const linear = [10, 90, "S", 40, true, null]

// * table

tableTest(new Map(tableEntries), tableKV)
tableTest(new BasicMap(tableEntries), tableKV)

// * fromPairsList

fromPairsTest(tableEntries, tableKV)

// * keyValueToPairsList

toPairsTest(tableKV, tableEntries)

// * linearToPairsList

linearPairsTest(linear, tableEntries)
