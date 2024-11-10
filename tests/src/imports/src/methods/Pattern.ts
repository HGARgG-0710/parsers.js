import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as Pattern from "../../../../../dist/src/Pattern/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("value")(
			...namesCapitalized(
				"delegate",
				"thisDelegate",
				"propDelegate",
				"replaceKey",
				"set",
				"delete",
				"replace",
				"size",
				"keys",
				"values",
				"default",
				"curr",
				"defaultIsEnd",
				"defaultIsStart",
				"index",
				"byIndex",
				"getIndex",
				"prev",
				"next",
				"isEnd",
				"rewind",
				"finish",
				"length"
			)
		)
	)
)("Pattern", Pattern)
