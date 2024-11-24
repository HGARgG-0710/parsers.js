import { arraysSame, tripleUtilTest } from "lib/lib.js"
import { matchString, tokenizeMatched } from "../../../../dist/src/Tokenizable/utils.js"

export const [matchStringTest, tokenizeMatchedTest] = [
	[matchString, "matchString"],
	[tokenizeMatched, "tokenizeMatched"]
].map(([util, name]) => tripleUtilTest(util as Function, name as string, arraysSame))
