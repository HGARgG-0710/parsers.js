import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as EliminablePattern from "../../../../../../dist/src/Pattern/EliminablePattern/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("eliminableStringPattern")(
			...namesCapitalized("flush", "eliminate")
		)
	)
)(EliminablePattern)
