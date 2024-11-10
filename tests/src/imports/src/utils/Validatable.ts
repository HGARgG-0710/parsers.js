import { functionImports, importTest } from "imports/lib/imports.js"
import * as Validatable from "../../../../../dist/src/Validatable/utils.js"

importTest(
	functionImports(
		"notValidMatch",
		"validateString",
		"validateTokenized",
		"analyzeValidity",
		"analyzedIndex",
		"analyzedValue",
		"isFaultyElement"
	)
)("Validatable", Validatable)
