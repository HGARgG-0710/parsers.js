import { functionImports, importTest, specificChildImports } from "imports/lib/imports.js"
import * as IndexMap from "../../../../../dist/src/IndexMap/methods.js"

import { typeof as type } from "@hgargg-0710/one"
const { isObject } = type

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
		.concat([["SubHaving", isObject]])
)(IndexMap)
