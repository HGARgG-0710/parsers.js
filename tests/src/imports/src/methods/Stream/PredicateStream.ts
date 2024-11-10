import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as PredicateStream from "../../../../../../dist/src/Stream/PredicateStream/methods.js"

importTest(
	functionImports(
		"predicateStreamCurr",
		...prefixedImportNames("effectivePredicateStream")(
			...namesCapitalized("next", "prod", "isEnd", "initialize", "defaultIsEnd")
		)
	)
)("PredicateStream", PredicateStream)
