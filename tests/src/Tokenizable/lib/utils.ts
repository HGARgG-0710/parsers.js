import { arraysSame, tripleUtilTest } from "lib/lib.js"
import {
	matchString,
	tokenizeString,
	tokenizeMatched
} from "../../../../dist/src/Tokenizable/utils.js"

export const [matchStringTest, tokenizeStringTest, tokenizeMatchedTest] = [
	[matchString, "matchString"],
	[tokenizeString, "tokenizeString"],
	[tokenizeMatched, "tokenizeMatched"]
].map(([util, name]) => tripleUtilTest(util as Function, name as string, arraysSame))
