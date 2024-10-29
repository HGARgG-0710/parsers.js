import { regexTest } from "./lib.js"

import { regex } from "../../../../dist/main.js"
const { occurences, non_greedy, plus, star, maybe } = regex.quantifiers

export const [non_greedy_test, plus_test, start_test, maybe_test, ocurrences_test] = [
	["non_greedy", non_greedy],
	["plus", plus],
	["star", star],
	["maybe", maybe],
	["occurences", occurences]
].map(([name, util]) => regexTest(name as string, util as Function))
