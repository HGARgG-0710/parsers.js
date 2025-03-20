import { comparisonUtilTest } from "lib/lib.js"

import { utils } from "../../../../dist/main.js"
const { table, fromPairs, toPairs, linearPairs } = utils.IndexMap

import { array } from "@hgargg-0710/one"
const { same } = array

const kvUtil = comparisonUtilTest(
	(
		[gotKeys, gotValues]: [any[], any[]],
		[expKeys, expValues]: [any[], any[]]
	) => same(gotKeys, expKeys) && same(gotValues, expValues)
)

export const [tableTest, fromPairsTest] = [
	[table, "table"],
	[fromPairs, "fromPairs"]
].map(([util, name]) => kvUtil(util as Function, name as string))

const toPairsListTest = comparisonUtilTest(
	(kvResult: [any, any][], kvExp: [any, any][]) =>
		kvResult.length === kvExp.length &&
		kvResult.every((x, i) => kvResult.length === 2 && same(x, kvExp[i]))
)

export const [toPairsTest, linearPairsTest] = [
	[toPairs, "toPairs"],
	[linearPairs, "linearPairs"]
].map(([util, name]) => toPairsListTest(util as Function, name as string))
