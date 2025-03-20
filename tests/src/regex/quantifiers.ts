import {
	maybe_test,
	non_greedy_test,
	plus_test,
	star_test
} from "./lib/quantifiers.js"

// * non_greedy
non_greedy_test("a+?", /a+/)
non_greedy_test("a*?", /a*/)
non_greedy_test("a??", /a?/)
non_greedy_test("a{2,10}?", /a{2,10}?/)

// * plus
plus_test("(?:ab?)+", /ab?/)
plus_test("(?:(?:))+", /(?:)/)

// * star
star_test("(?:ab?)*", /ab?/)
star_test("(?:(?:))*", /(?:)/)

// * maybe
maybe_test("(?:ab+)?", /ab+/)
maybe_test("(?:(?:))?", /(?:)/)
