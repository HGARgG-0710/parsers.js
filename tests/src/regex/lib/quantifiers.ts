import { regexCurriedTest, regexTest } from "./lib.js"

import { regex } from "../../../../dist/main.js"
const { occurrences, non_greedy, plus, star, maybe } = regex.quantifiers

export const [non_greedy_test, plus_test, star_test, maybe_test] = [
	["non_greedy", non_greedy],
	["plus", plus],
	["star", star],
	["maybe", maybe]
].map(([name, util]) => regexTest(name as string, util as Function))

export const occurrences_test_1 = regexCurriedTest("occurences", occurrences, 1)
export const occurrences_test_2 = regexCurriedTest("occurences", occurrences, 2)
