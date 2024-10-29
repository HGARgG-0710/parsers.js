import {
	caret_test,
	charclass_test,
	cr_test,
	digit_test,
	ffeed_test,
	htab_test,
	lnfeed_test,
	nil_test,
	non_digit_test,
	non_space_test,
	non_uni_prop_test,
	non_word_test,
	or_test,
	space_test,
	uni_hex_2_test,
	uni_hex_4_test,
	uni_hex_5_test,
	uni_prop_test,
	vtab_test,
	wildcard_test,
	word_test
} from "./lib/charclass.js"

// * charclass
charclass_test("[]")
charclass_test("[a]", "a")
charclass_test("[aT-Z_]", "a", ["T", "Z"], "_")

// * neg_charclass
charclass_test("[^]")
charclass_test("[^a]", "a")
charclass_test("[^aT-Z_]", "a", ["T", "Z"], "_")

// * digit
digit_test("\\d")

// * non_digit
non_digit_test("\\D")

// * word
word_test("\\w")

// * non_word
non_word_test("\\W")

// * non_space
space_test("\\s")

// * non_space
non_space_test("\\S")

// * wildcard
wildcard_test(".")

// * htab
htab_test("\\t")

// * cr
cr_test("\\r")

// * lnfeed
lnfeed_test("\\n")

// * ffeed
ffeed_test("\\f")

// * vtab
vtab_test("\\v")

// * nil
nil_test("\0")

// * uni_hex_5
uni_hex_5_test("\\u{902}", 902)
uni_hex_5_test("\\u{1400}", "1400")

// * uni_prop
uni_prop_test("\\p{Script_Extension=Latin}", ["Script_Extension", "Latin"])
uni_prop_test("\\p{Emoji_Presentation}", "Emoji_Presentation")

// * non_uni_prop
non_uni_prop_test("\\p{Script_Extension=Latin}", ["Script_Extension", "Latin"])
non_uni_prop_test("\\p{Emoji_Presentation}", "Emoji_Presentation")

// * caret
caret_test("cR", "R")
caret_test("cA", "A")

// * uni_hex_2
uni_hex_2_test("xA9", "A9")
uni_hex_2_test("xGF", "GF")

// * uni_hex_4
uni_hex_4_test("u90AF", "90AF")
uni_hex_4_test("u8881", "8881")

// * or
or_test("(?:c?r*naa?)|(?:b(?=RO?x+))|(?:ax?)", /c?r*naa?/, /b(?=RO?x+)/, /ax?/)
or_test("(?:ax+)", /ax+/)
or_test("(?:/ax+/)|(?:(?:))", /ax+/, /(?:)/)
