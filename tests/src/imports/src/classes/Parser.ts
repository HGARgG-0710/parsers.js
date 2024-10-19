import { importTest, objectImports } from "imports/lib/imports.js"
import * as Parser from "../../../../../dist/src/Parser/classes.js"

importTest(
	objectImports(
		"BasicParser",
		"GeneralParser",
		"LayeredParser",
		"PatternEliminator",
		"PatternTokenizer",
		"PatternValidator",
		"PositionalValidator",
		"SkipParser",
		"StreamLocator",
		"StreamTokenizer",
		"StreamValidator",
		"TableMap"
	)
)(Parser)
