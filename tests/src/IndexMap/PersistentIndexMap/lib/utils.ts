import { comparisonUtilTest } from "lib/lib.js"
import { utils } from "../../../../../dist/main.js"
import type { PersistentIndexMap } from "../../../../../dist/src/IndexMap/PersistentIndexMap/interfaces.js"
import { isIndexMap } from "IndexMap/lib/classes.js"
const { fromPairsList } = utils.IndexMap.PersistentIndexMap

export const fromPairsListTest = comparisonUtilTest(
	(resultPersistentMap: PersistentIndexMap, expected: [any, any, number][]) => {
		if (!isIndexMap(resultPersistentMap)) return false
		for (let i = 0; i < expected.length; ++i) {
			const [key, value, index] = expected[i]
			if (
				resultPersistentMap.index(key) !== value ||
				resultPersistentMap.indexes[i].value !== index
			)
				return false
		}
		return true
	}
)(fromPairsList, "fromPairsList")
