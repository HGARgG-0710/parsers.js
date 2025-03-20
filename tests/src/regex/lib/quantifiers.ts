import { regexTest } from "./lib.js"

import { regex } from "../../../../dist/main.js"
const { non_greedy, some, any, maybe } = regex.quantifiers

export const [non_greedy_test, plus_test, star_test, maybe_test] = [
	["non_greedy", non_greedy],
	["some", some],
	["any", any],
	["maybe", maybe]
].map(([name, util]) => regexTest(name as string, util as Function))
