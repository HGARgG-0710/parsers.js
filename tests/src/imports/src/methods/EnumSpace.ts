import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as EnumSpace from "../../../../../dist/src/EnumSpace/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("constEnum")(
			...namesCapitalized("add", "join", "copy", "map")
		)
	)
)("EnumSpace", EnumSpace)
