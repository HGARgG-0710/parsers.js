import { arraysSame, comparisonUtilTest } from "lib/lib.js"

import { utils } from "../../../../dist/main.js"
const { table, fromPairsList, toPairsList } = utils.IndexMap

const kvUtil = comparisonUtilTest(
	([gotKeys, gotValues]: [any[], any[]], [expKeys, expValues]: [any[], any[]]) =>
		arraysSame(gotKeys, expKeys) && arraysSame(gotValues, expValues)
)
export const [tableTest, fromPairsListTest] = [
	[table, "table"],
	[fromPairsList, "fromPairsList"]
].map(([util, name]) => kvUtil(util as Function, name as string))

export const toPairsListTest = comparisonUtilTest(
	(kvResult: [any, any][], kvExp: [any, any][]) =>
		kvResult.length === kvExp.length &&
		kvResult.every((x, i) => arraysSame(x, kvExp[i]))
)(toPairsList, "toPairsList")
