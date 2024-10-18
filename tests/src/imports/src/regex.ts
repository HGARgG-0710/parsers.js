import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as regex from "../../../../dist/src/regex.js"

importTest(
	functionImports("char_ranges", "regex_contents", "and", "regex", "default").concat(
		objectImports("assertions", "charclass", "flags", "groups", "quantifiers")
	)
)(regex)
