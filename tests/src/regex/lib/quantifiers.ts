import { regex } from "../../../../dist/main.js"
import { complexRegexTest, elementaryRegexTest } from "./lib.js"
const { occurences, non_greedy, plus, star, maybe } = regex.quantifiers

export const ocurrences_test = complexRegexTest("occurences", occurences)

export const [non_greedy_test, plus_test, start_test, maybe_test] = [
	["non_greedy", non_greedy],
	["plus", plus],
	["star", star],
	["maybe", maybe]
].map(([name, util]) => elementaryRegexTest(name as string, util as Function))
