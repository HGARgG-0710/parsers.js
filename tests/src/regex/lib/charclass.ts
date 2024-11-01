import { regex } from "../../../../dist/main.js"
import { regexCurriedTest, regexTest } from "./lib.js"

const {
	charclass,
	neg_charclass,
	or,
	digit,
	non_digit,
	word,
	non_word,
	space,
	non_space,
	wildcard,
	htab,
	cr,
	lnfeed,
	ffeed,
	vtab,
	nil,
	uni_hex_5,
	uni_prop,
	non_uni_prop,
	caret,
	uni_hex_2,
	uni_hex_4
} = regex.charclass

export const [
	digit_test,
	non_digit_test,
	word_test,
	non_word_test,
	space_test,
	non_space_test,
	wildcard_test,
	htab_test,
	cr_test,
	lnfeed_test,
	ffeed_test,
	vtab_test,
	nil_test,
	charclass_test,
	neg_charclass_test,
	or_test
] = [
	["digit", digit],
	["non_digit", non_digit],
	["word", word],
	["non_word", non_word],
	["space", space],
	["non_space", non_space],
	["wildcard", wildcard],
	["htab", htab],
	["cr", cr],
	["lnfeed", lnfeed],
	["ffeed", ffeed],
	["vtab", vtab],
	["nil", nil],
	["charclass", charclass],
	["neg_charclass", neg_charclass],
	["or", or]
].map(([name, util]) => regexTest(name as string, util as Function))

export const [
	uni_hex_5_test,
	uni_prop_test,
	non_uni_prop_test,
	caret_test,
	uni_hex_2_test,
	uni_hex_4_test
] = [
	["uni_hex_5", uni_hex_5, 1],
	["uni_prop", uni_prop, 1],
	["non_uni_prop", non_uni_prop, 1],
	["caret", caret, 1],
	["uni_hex_2", uni_hex_2, 1],
	["uni_hex_4", uni_hex_4, 1]
].map(([name, util, arity]) =>
	regexCurriedTest(name as string, util as Function, arity as number)
)
