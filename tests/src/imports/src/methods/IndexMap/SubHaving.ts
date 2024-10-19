import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as SubHaving from "../../../../../../dist/src/IndexMap/SubHaving/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("sub")(
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
				"index",
				"byIndex",
				"getIndex"
			)
		)
	)
)(SubHaving)
