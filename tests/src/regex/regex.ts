import { and_test, regex_contents_test } from "./lib/regex.js"

// * regex_contents
regex_contents_test("a", /a/)
regex_contents_test("b+c?rr*", /b+c?rr*/)
regex_contents_test("r{2,}k[79x]", /r{2,}k[79x]/)
regex_contents_test("ab+", /ab+/s)

// * and
and_test("(?:a+90?(c@?)+)", /a+90?(c@?)+/)
and_test("(?:790+)(?:x920)(?:a*b??)", /790+/, /[x920]/, /a*b??/)
