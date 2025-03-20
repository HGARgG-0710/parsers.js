import {
	Pairs,
	PersistentIndexMap,
	Pointer,
	TokenMap
} from "../../../../dist/src/IndexMap/classes.js"

import {
	BasicTable,
	PersistentIndexTable
} from "../../../../dist/src/IndexMap/LookupTable/classes.js"

import { TokenHash } from "../../../../dist/src/IndexMap/HashMap/classes.js"
import { MapInternalHash } from "../../../../dist/src/IndexMap/HashMap/InternalHash/classes.js"
import { OptimizedLinearMap } from "../../../../dist/src/IndexMap/LinearIndexMap/classes.js"
import type { IPointer } from "../../../../dist/src/interfaces.js"
import { value } from "../../../../dist/src/Pattern/utils.js"
import { TokenInstance } from "../../../../dist/src/Token/classes.js"

import { LookupTableClassTest } from "./lib/classes.js"

const v = value as <Type = any>(x: IPointer<Type>) => Type

// * BasicHashTable

const [A, B, C, D, E] = ["a", "b", "c", "d", "e"].map(TokenInstance)

const [a1Basic, a2Basic, a3Basic] = Array.from({ length: 3 }, () => new A())
const bBasic = new B()
const cBasic = new C()
const dBasic = new D()

const basicHashDefault = false

const basicHashInput = new TokenHash(
	new MapInternalHash(
		Pairs<string, any>(["a", 20], ["b", 443], ["c", true], ["e", 1000]),
		basicHashDefault
	)
)

const basicHash = new BasicTable(basicHashInput)

LookupTableClassTest("BasicHashTable", BasicTable, [
	{
		input: basicHashInput,
		getIndexTests: [
			[a1Basic, a1Basic],
			[bBasic, bBasic],
			[E, E]
		],
		setTests: [
			[new C(), 30],
			[new D(), -90]
		],
		byOwnedTests: [],
		replaceKeyTests: [
			[D, B, bBasic, dBasic, basicHashDefault],
			[C, A, a2Basic, cBasic, basicHashDefault]
		],
		deleteTests: [A, C]
	}
])

// * PersistentIndexFastLookupTable

const aIndex = new A()
const bIndex = new B()
const cIndex = new C()
const dIndex = new D()

const indexInput = new PersistentIndexMap(
	new (TokenMap(OptimizedLinearMap))(
		Pairs([A, "Soos"], [B, "Mabel"], [D, "Larry"]),
		"MISSING"
	)
)

const indexHandler = new PersistentIndexTable(indexInput)

LookupTableClassTest("PersistentIndexFastLookupTable", PersistentIndexTable, [
	{
		input: indexInput,
		getIndexTests: [
			[bIndex, Pointer(1), v],
			[aIndex, Pointer(0), v],
			[dIndex, Pointer(2), v],
			[cIndex, Pointer(-1), v]
		],
		setTests: [
			[dIndex, "Stanford"],
			[C, "Dipper"]
		],
		byOwnedTests: [],
		replaceKeyTests: [
			[C, D, dIndex, cIndex, "MISSING"],
			[A, B, bIndex, aIndex, "MISSING"]
		],
		deleteTests: [B, C]
	}
])
