import { importTest, objectImports } from "imports/lib/imports.js"
import * as Parser from "../../../../../dist/src/Parser/interfaces.js"

importTest(
	objectImports(
		"BasicParser",
		"GeneralParser",
		"LayeredParser",
		"PatternValidator",
		"PositionalValidator",
		"SkipParser",
		"StreamLocator",
		"StreamTokenizer",
		"StreamValidator",
		"TableMap"
	)
)(Parser)
