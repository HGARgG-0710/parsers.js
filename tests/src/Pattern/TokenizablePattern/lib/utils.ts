import { arraysSame, tripleUtilTest } from "lib/lib.js"
import { utils } from "../../../../../dist/main.js"
const { tokenizeString, tokenizeMatched } = utils.Pattern.TokenizablePattern

export const [tokenizeStringTest, tokenizeMatchedTest] = [
	[tokenizeString, "tokenizeString"],
	[tokenizeMatched, "tokenizeMatched"]
].map(([util, name]) => tripleUtilTest(util as Function, name as string, arraysSame))
