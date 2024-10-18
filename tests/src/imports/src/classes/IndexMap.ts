import { functionImports, importTest, specificChildImports } from "imports/lib/imports.js"

import * as IndexMap from "../../../../../dist/src/IndexMap/classes.js"

importTest(
	functionImports(
		"TokenMap",
		"ValueMap",
		"CurrentMap",
		"FirstStreamMap",
		"TypeofMap"
	).concat(specificChildImports.IndexMap)
)(IndexMap)
