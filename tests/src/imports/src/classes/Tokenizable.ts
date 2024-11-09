import { functionImports, importTest } from "imports/lib/imports.js"
import * as Tokenizable from "../../../../../dist/src/Tokenizable/classes.js"
importTest(functionImports("TokenizableString", "DelegateTokenizable"))(
	"Tokenizable",
	Tokenizable
)
