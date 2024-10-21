import { functionImports, importTest } from "imports/lib/imports.js"
import * as assertions from "../../../../../dist/src/regex/assertions.js"

importTest(
	functionImports(
		"lookahead",
		"neg_lookahead",
		"lookbehind",
		"neg_lookbehind",
		"word_boundry",
		"non_word_boundry",
		"begin",
		"end"
	)
)(assertions)
