import { functionImports, importTest } from "imports/lib/imports.js"
import * as Tokenizable from "../../../../../dist/src/Tokenizable/utils.js"
importTest(functionImports("matchString", "tokenizeString", "tokenizeMatched"))(
	"Tokenizable",
	Tokenizable
)
