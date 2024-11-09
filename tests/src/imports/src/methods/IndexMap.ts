import {
	functionImports,
	importTest,
	objectImports,
	specificChildImports
} from "imports/lib/imports.js"
import * as IndexMap from "../../../../../dist/src/IndexMap/methods.js"

importTest(
	functionImports(
		"indexMapUnique",
		"indexMapIterator",
		"indexMapByIndex",
		"indexMapSwap",
		"indexMapCopy",
		"indexMapSizeGetter",
		"indexMapSet"
	)
		.concat(specificChildImports.IndexMap)
		.concat(objectImports("PersistentIndexMap"))
)(IndexMap)
