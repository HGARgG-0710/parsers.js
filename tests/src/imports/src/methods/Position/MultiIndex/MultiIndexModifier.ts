import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as MultiIndexModifier from "../../../../../../../dist/src/Position/MultiIndex/MultiIndexModifier/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("multiIndexModifier")(
			...namesCapitalized("clear", "resize", "extend", "initialize"),
			"PrevLevel",
			"NextLevel",
			"IncLast",
			"DecLast"
		)
	)
)("MultiIndexModifier", MultiIndexModifier)
