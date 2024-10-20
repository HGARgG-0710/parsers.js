import { importTest, objectImports } from "imports/lib/imports.js"
import * as Pattern from "../../../../../dist/src/Pattern/methods.js"

importTest(
	objectImports(
		"Collection",
		"EliminablePattern",
		"EnumSpace",
		"TokenizablePattern",
		"ValidatablePattern"
	)
)(Pattern)
