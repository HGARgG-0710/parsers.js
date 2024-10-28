import { comparisonUtilTest } from "lib/lib.js"
import { utils } from "../../../../../dist/main.js"
import type { HashMap } from "../../../../../dist/src/IndexMap/HashMap/interfaces.js"
const { fromPairsList } = utils.IndexMap.HashMap

export const fromPairsListTest = comparisonUtilTest(
	(hashResult: HashMap, pairsList: [any, any][]) => {
		for (const [key, value] of pairsList)
			if (hashResult.index(key) !== value) return false
		return true
	}
)(fromPairsList, "fromPairsList")
