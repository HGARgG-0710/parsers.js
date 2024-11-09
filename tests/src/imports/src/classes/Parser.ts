import { importTest, objectImports } from "imports/lib/imports.js"
import * as Parser from "../../../../../dist/src/Parser/classes.js"

importTest(
	objectImports(
		"LayeredParser",
		"PatternEliminator",
		"PatternTokenizer",
		"PatternValidator",
		"TableMap"
	)
)("Parser", Parser)
