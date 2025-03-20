import type { IHashMap } from "../../../../../dist/src/IndexMap/HashMap/interfaces.js"

import { comparisonUtilTest } from "lib/lib.js"
import { utils } from "../../../../../dist/main.js"
const { fromPairs } = utils.IndexMap.HashMap

export const fromPairsListTest = comparisonUtilTest(
	(hashResult: IHashMap, pairsList: [any, any][]) => {
		for (const [key, value] of pairsList)
			if (hashResult.index(key) !== value) return false
		return true
	}
)(fromPairs, "fromPairsList")
