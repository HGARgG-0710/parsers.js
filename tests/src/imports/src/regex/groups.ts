import { functionImports, importTest } from "imports/lib/imports.js"
import * as groups from "../../../../../dist/src/regex/groups.js"

importTest(
	functionImports(
		"bracket",
		"non_bracket",
		"capture",
		"non_capture",
		"named_capture",
		"bref",
		"named_bref"
	)
)(groups)
