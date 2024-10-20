import { functionImports, importTest } from "imports/lib/imports.js"
import * as Token from "../../../../../../dist/src/Pattern/Token/classes.js"
importTest(functionImports("Token", "SimpleTokenType", "TokenInstance", "TokenTree"))(
	Token
)
