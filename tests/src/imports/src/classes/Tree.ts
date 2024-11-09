import { functionImports, importTest } from "imports/lib/imports.js"
import * as Tree from "../../../../../dist/src/Tree/classes.js"
importTest(
	functionImports(
		"ChildrenTree",
		"ChildlessTree",
		"SingleTree",
		"MultTree",
		"TreeWalker"
	)
)("Tree", Tree)
