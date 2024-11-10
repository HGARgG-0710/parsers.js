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
			...namesCapitalized("index", "replace", "add", "delete").concat([
				"ReplaceKey",
				"GetIndex"
			])
		).concat([
			"optimizedLinearIndexMapGetIndex",
			...prefixedImportNames("mapClassExtend")("", "Key")
		])
	)
)("LinearIndexMap", LinearIndexMap)
