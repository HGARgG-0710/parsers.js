import { and_test, char_ranges_test, regex_contents_test } from "./lib/regex.js"

// * regex_contents
regex_contents_test("a", /a/)
regex_contents_test("b+c?rr*", /b+c?rr*/)
regex_contents_test("r{2,}k[79x]", /r{2,}k[79x]/)
regex_contents_test("ab+", /ab+/s)

// * and
and_test("(?:a+90?(c@?)+)", /a+90?(c@?)+/)
and_test("(?:790+)(?:x920)(?:a*b??)", /790+/, /[x920]/, /a*b??/)

// * char_ranges
char_ranges_test("abcvgd", "ab", "cvg", "d")
char_ranges_test("90-3x-z\\b", "9", ["0", "3"], ["x", "z"], "\\b")
char_ranges_test("0-39x-z\\b", ["0", "3"], "9", ["x", "z"], "\\b")
