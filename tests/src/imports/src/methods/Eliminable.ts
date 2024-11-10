import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as Eliminable from "../../../../../dist/src/Eliminable/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("eliminableString")(
			...namesCapitalized("flush", "eliminate")
		)
	)
)("Eliminable", Eliminable)
