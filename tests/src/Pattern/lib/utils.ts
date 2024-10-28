import { arraysSame, comparisonUtilTest } from "lib/lib.js"
import { utils } from "../../../../dist/main.js"
const { matchString } = utils.Pattern

export const matchStringTest = comparisonUtilTest(arraysSame)(matchString, "matchString")
