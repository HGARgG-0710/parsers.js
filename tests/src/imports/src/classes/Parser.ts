import { importTest, objectImports } from "imports/lib/imports.js"
import * as Parser from "../../../../../dist/src/Parser/classes.js"

importTest(
	objectImports(
		"LayeredFunction",
		"PatternEliminator",
		"PatternTokenizer",
		"PatternValidator",
		"TableMap"
	)
)("Parser", Parser)
