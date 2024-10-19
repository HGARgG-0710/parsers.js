import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as LinearIndexMap from "../../../../../../dist/src/IndexMap/LinearIndexMap/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("linearIndexMap")(
			...namesCapitalized(
				"index",
				"replace",
				"add",
				"delete",
				"replaceKey",
				"getIndex"
			)
		).concat([
			"optimizedLinearIndexMapGetIndex",
			...prefixedImportNames("mapClassExtend")("", "Key")
		])
	)
)(LinearIndexMap)
