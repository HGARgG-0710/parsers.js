import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as IndexMap from "../../../../../dist/src/IndexMap/utils.js"

importTest(
	functionImports("table", "fromPairsList", "toPairsList").concat(
		objectImports("HashMap", "PersistentIndexMap")
	)
)("IndexMap", IndexMap)
