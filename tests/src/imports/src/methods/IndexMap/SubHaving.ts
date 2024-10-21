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
				"set",
				"delete",
				"replace",
				"size",
				"keys",
				"values",
				"default",
				"index"
			).concat([
				"ThisDelegate",
				"PropDelegate",
				"ReplaceKey",
				"ByIndex",
				"GetIndex"
			])
		)
	)
)(SubHaving)
