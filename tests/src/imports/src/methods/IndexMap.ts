import {
	functionImports,
	importTest,
	namesCapitalized,
	objectImports,
	prefixedImportNames,
	specificChildImports
} from "imports/lib/imports.js"
import * as IndexMap from "../../../../../dist/src/IndexMap/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("indexMap")(
			...namesCapitalized(
				"unique",
				"iterator",
				"byIndex",
				"swap",
				"copy",
				"sizeGetter",
				"set"
			)
		)
	)
		.concat(specificChildImports.IndexMap)
		.concat(objectImports("PersistentIndexMap"))
)("IndexMap", IndexMap)
