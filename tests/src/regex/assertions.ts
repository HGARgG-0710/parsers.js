import { and } from "../../../dist/src/regex.js"
import { begin, neg_lookbehind } from "../../../dist/src/regex/assertions.js"
import {
	begin_test,
	end_test,
	lookahead_test,
	lookbehind_test,
	neg_lookahead_test,
	neg_lookbehind_test,
	non_word_boundry_test,
	word_boundry_test
} from "./lib/assertions.js"

// * lookahead
lookahead_test("(?=r+o??)", /r+o??/)
lookahead_test("(?=(?:90+)(?:a?b?)(?:r{7,}))", and(/90+/, /a?b?/, /r{7,}/))

// * neg_lookahead
neg_lookahead_test("(?!r+o??)", /r+o??/)
neg_lookahead_test("(?!(?:90+)(?:a?b?)(?:r{7,}))", and(/90+/, /a?b?/, /r{7,}/))

// * lookbehind
lookbehind_test("(?<=r+o??)", /r+o??/)
lookbehind_test("(?<=(?:90+)(?:a?b?)(?:r{7,}))", and(/90+/, /a?b?/, /r{7,}/))

// * neg_lookbehind
neg_lookbehind_test("(?<!r+o??)", /r+o??/)
neg_lookbehind_test("(?<!(?:90+)(?:a?b?)(?:r{7,}))", and(/90+/, /a?b?/, /r{7,}/))

// * word_boundry
word_boundry_test("\\b")

// * non_word_boundry
non_word_boundry_test("\\B")

// * begin
begin_test("^[a-zA-Z0-9][a-zA-Z0-9]+", /[a-zA-Z0-9][a-zA-Z0-9]+/)
begin_test("^k*", /k*/)

// * end
end_test("^90a+b*?$", begin(/90a+b*?/))
end_test("(?!(?:440?x))$", neg_lookbehind(/440?x/))
