import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as Collection from "../../../../../../dist/src/Pattern/Collection/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("stringCollection")(
			...namesCapitalized("push", "iterator")
		).concat(
			prefixedImportNames("accumulatingPatternCollection")(
				...namesCapitalized("push", "iterator")
			)
		)
	)
)(Collection)
