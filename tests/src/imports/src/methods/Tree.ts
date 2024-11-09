import { functionImports, importTest } from "imports/lib/imports.js"
import * as Tree from "../../../../../dist/src/Tree/methods.js"

importTest(
	functionImports(
		"baseChildIndex",
		"baseChildrenCount",
		"childIndex",
		"childrenCount"
	).concat(functionImports("TreeWalker"))
)("Tree", Tree)
