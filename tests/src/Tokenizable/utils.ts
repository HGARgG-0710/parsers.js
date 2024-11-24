import { value } from "../../../dist/src/Pattern/utils.js"
import { SimpleTokenType } from "../../../dist/src/Token/classes.js"
import { matchString } from "../../../dist/src/Tokenizable/utils.js"
import { classWrapper } from "../../../dist/src/utils.js"
import { matchStringTest, tokenizeMatchedTest } from "./lib/utils.js"

// * matchString

const matchInput = "Saai,lair, Moir,  \n\nBlair, \t\tstairs"
const wordRegex = /\w+/g

matchStringTest([matchInput, wordRegex], ["Saai", "lair", "Moir", "Blair", "stairs"])
matchStringTest([matchInput, /,\s*/g], [",", ", ", ",  \n\n", ", \t\t"])

// * tokenizeMatched

const Word = SimpleTokenType("word")

tokenizeMatchedTest(
	[matchInput, matchString(matchInput, wordRegex), classWrapper(Word)],
	[
		new Word("Saai"),
		",",
		new Word("lair"),
		", ",
		new Word("Moir"),
		",  \n\n",
		new Word("Blair"),
		", \t\t"
	],
	(x: any, y: any) => Word.is(x) && Word.is(y) && value(x) === value(y)
)
