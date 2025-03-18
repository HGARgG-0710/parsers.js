import {
	Pairs,
	PersistentIndexMap,
	Pointer,
	TokenMap
} from "../../../../dist/src/IndexMap/classes.js"

import {
	BasicHashTable,
	PersistentIndexFastLookupTable
} from "../../../../dist/src/IndexMap/FastLookupTable/classes.js"

import { TokenHash } from "../../../../dist/src/IndexMap/HashMap/classes.js"
import { MapInternalHash } from "../../../../dist/src/IndexMap/HashMap/InternalHash/classes.js"
import { OptimizedLinearMap } from "../../../../dist/src/IndexMap/LinearIndexMap/classes.js"
import { value } from "../../../../dist/src/Pattern/utils.js"
import { TokenInstance } from "../../../../dist/src/Token/classes.js"

import { FastLookupTableClassTest } from "./lib/classes.js"

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

const basicHash = new BasicHashTable(basicHashInput)

FastLookupTableClassTest("BasicHashTable", BasicHashTable, [
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
		byOwnedTests: [
			[a2Basic, basicHash.getIndex(a2Basic), 20],
			[a3Basic, basicHash.getIndex(a3Basic), 20],
			[dBasic, basicHash.getIndex(dBasic), -90],
			[cBasic, basicHash.getIndex(cBasic), 30]
		],
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

const indexHandler = new PersistentIndexFastLookupTable(indexInput)

FastLookupTableClassTest(
	"PersistentIndexFastLookupTable",
	PersistentIndexFastLookupTable,
	[
		{
			input: indexInput,
			getIndexTests: [
				[bIndex, Pointer(1), value],
				[aIndex, Pointer(0), value],
				[dIndex, Pointer(2), value],
				[cIndex, Pointer(-1), value]
			],
			setTests: [
				[dIndex, "Stanford"],
				[C, "Dipper"]
			],
			byOwnedTests: [
				[cIndex, indexHandler.getIndex(cIndex), "Dipper"],
				[aIndex, indexHandler.getIndex(aIndex), "Soos"],
				[dIndex, indexHandler.getIndex(dIndex), "Stanford"],
				[bIndex, indexHandler.getIndex(bIndex), "Mabel"]
			],
			replaceKeyTests: [
				[C, D, dIndex, cIndex, "MISSING"],
				[A, B, bIndex, aIndex, "MISSING"]
			],
			deleteTests: [B, C]
		}
	]
)
