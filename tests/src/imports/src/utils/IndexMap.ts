import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as IndexMap from "../../../../../dist/src/IndexMap/utils.js"

importTest(
	objectImports("HashMap", "PersistentIndexMap").concat(
		functionImports("table", "fromPairsList", "toPairsList")
	)
)(IndexMap)
