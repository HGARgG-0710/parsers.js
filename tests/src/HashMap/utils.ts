import { BasicHash } from "../../../../dist/src/IndexMap/HashMap/classes.js"
import { MapInternalHash } from "../../../../dist/src/IndexMap/HashMap/InternalHash/classes.js"
import { fromPairsListTest } from "./lib/utils.js"

// * fromPairsList

const pairs = [
	[true, false],
	[false, null],
	[null, true]
]

fromPairsListTest(pairs, BasicHash, MapInternalHash, [...pairs, [7, null]], null)
