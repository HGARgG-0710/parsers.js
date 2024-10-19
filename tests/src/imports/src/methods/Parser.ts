import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as Parser from "../../../../../dist/src/Parser/methods.js"

importTest(
	objectImports(
		"BasicParser",
		"LayeredParser",
		"SkipParser",
		"StreamLocator",
		"StreamTokenizer",
		"StreamValidator"
	).concat(functionImports("firstFinished"))
)(Parser)
