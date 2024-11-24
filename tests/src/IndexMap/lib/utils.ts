import { arraysSame, comparisonUtilTest } from "lib/lib.js"

import { utils } from "../../../../dist/main.js"
const { table, fromPairsList, keyValuesToPairsList, linearToPairsList } = utils.IndexMap

const kvUtil = comparisonUtilTest(
	([gotKeys, gotValues]: [any[], any[]], [expKeys, expValues]: [any[], any[]]) =>
		arraysSame(gotKeys, expKeys) && arraysSame(gotValues, expValues)
)
export const [tableTest, fromPairsListTest] = [
	[table, "table"],
	[fromPairsList, "fromPairsList"]
].map(([util, name]) => kvUtil(util as Function, name as string))

const toPairsListTest = comparisonUtilTest(
	(kvResult: [any, any][], kvExp: [any, any][]) =>
		kvResult.length === kvExp.length &&
		kvResult.every((x, i) => kvResult.length === 2 && arraysSame(x, kvExp[i]))
)

export const [keyValuesToPairsListTest, linearToPairsListTest] = [
	[keyValuesToPairsList, "keyValuesToPairsList"],
	[linearToPairsList, "linearToPairsList"]
].map(([util, name]) => toPairsListTest(util as Function, name as string))
