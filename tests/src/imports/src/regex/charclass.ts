import { functionImports, importTest } from "imports/lib/imports.js"
import * as charclass from "../../../../../dist/src/regex/charclass.js"

importTest(
	functionImports(
		"charclass",
		"neg_charclass",
		"digit",
		"non_digit",
		"word",
		"non_word",
		"space",
		"non_space",
		"wildcard",
		"htab",
		"cr",
		"lnfeed",
		"ffeed",
		"vtab",
		"nil",
		"uni_hex_5",
		"uni_prop",
		"non_uni_prop",
		"caret",
		"uni_hex_2",
		"uni_hex_4",
		"or"
	)
)(charclass)
