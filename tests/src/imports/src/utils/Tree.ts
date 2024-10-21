import { functionImports, importTest } from "imports/lib/imports.js"
import * as Tree from "../../../../../dist/src/Tree/utils.js"

importTest(
	functionImports(
		"sequentialIndex",
		"mapPropsPreserve",
		"arrayTreeMapPreserve",
		"recursiveTreeCopy",
		"baseRecursiveTreeCopy"
	)
)(Tree)
