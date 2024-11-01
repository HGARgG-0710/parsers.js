import {
	bracket_test,
	bref_test,
	capture_test,
	named_bref_test,
	named_capture_test,
	non_bracket_test,
	non_capture_test
} from "./lib/groups.js"

// * bracket_test
bracket_test("(ab+)", /ab+/)
bracket_test("((?:))", /(?:)/)

// * non_bracket_test
non_bracket_test("(?:ab+)", /ab+/)
non_bracket_test("(?:(?:))", /(?:)/)

// * capture
capture_test("(ab+)", /ab+/)
capture_test("((?:))", /(?:)/)

// * non_capture
non_capture_test("(?:ab+)", /ab+/)
non_capture_test("(?:(?:))", /(?:)/)

// * named_capture
named_capture_test("(?<given_name>ab+)", "given_name", /ab+/)
named_capture_test("(?<arg>(?:))", "arg", /(?:)/)

// * bref
bref_test("\\0", 0)
bref_test("\\19", "19")

// * named_bref
named_bref_test("\\k<given_name>", "given_name")
