import { importTest, objectImports } from "imports/lib/imports.js"
import * as methods from "../../../../dist/src/methods.js"

importTest(
	objectImports(
		"Collection",
		"Eliminable",
		"EnumSpace",
		"IndexMap",
		"Parser",
		"Pattern",
		"Position",
		"Stream",
		"Tokenizable",
		"Tree",
		"Validatable"
	)
)("methods", methods)
