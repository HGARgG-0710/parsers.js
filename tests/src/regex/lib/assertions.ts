import { regexTest } from "./lib.js"
import { regex } from "../../../../dist/main.js"

const {
	lookahead,
	neg_lookahead,
	lookbehind,
	neg_lookbehind,
	word_boundry,
	non_word_boundry,
	begin,
	end
} = regex.assertions

export const [
	lookahead_test,
	neg_lookahead_test,
	lookbehind_test,
	neg_lookbehind_test,
	word_boundry_test,
	non_word_boundry_test,
	begin_test,
	end_test
] = [
	["lookahead", lookahead],
	["neg_lookahead", neg_lookahead],
	["lookbehind", lookbehind],
	["neg_lookbehind", neg_lookbehind],
	["word_boundry", word_boundry],
	["non_word_boundry", non_word_boundry],
	["begin", begin],
	["end", end]
].map(([name, util]) => regexTest(name as string, util as Function))
