import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as Tokenizable from "../../../../../dist/src/Tokenizable/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("tokenizableStringPattern")(
			...namesCapitalized("tokenize", "flush")
		)
	)
)("Tokenizable", Tokenizable)
