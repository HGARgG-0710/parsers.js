import {
	maybe_test,
	non_greedy_test,
	occurrences_test_1,
	occurrences_test_2,
	plus_test,
	star_test
} from "./lib/quantifiers.js"

// * occurences
occurrences_test_1("(?:a+b?){12}", 12, /a+b?/)
occurrences_test_1("(?:a+b?){5}", "5", /a+b?/)
occurrences_test_2("(?:a+b?){1,3}", 1, 3, /a+b?/)
occurrences_test_2("(?:a+b?){2,}", 2, "", /a+b?/)
occurrences_test_2("(?:a+b?){1,11}", "1", "11", /a+b?/)

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
