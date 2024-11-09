import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as Token from "../../../../../dist/src/Token/classes.js"

importTest(
	functionImports("Token", "SimpleTokenType", "TokenInstance").concat(
		objectImports("TokenTree")
	)
)("Token", Token)
