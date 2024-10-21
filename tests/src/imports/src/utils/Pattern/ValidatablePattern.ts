import { functionImports, importTest } from "imports/lib/imports.js"
import * as ValidatablePattern from "../../../../../../dist/src/Pattern/ValidatablePattern/utils.js"
importTest(
	functionImports("validateString", "analyzeValidity", "analyzedIndex", "analyzedValue")
)(ValidatablePattern)
