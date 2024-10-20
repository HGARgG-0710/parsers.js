import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as Pattern from "../../../../../dist/src/Pattern/utils.js"
importTest(
	functionImports("matchString").concat(
		objectImports("Token", "TokenizablePattern", "ValidatablePattern")
	)
)(Pattern)
