import { functionImports, importTest, specificChildImports } from "imports/lib/imports.js"
import * as Tree from "../../../../../dist/src/Tree/classes.js"
importTest(
	functionImports("ChildrenTree", "ChildlessTree", "SingleTree", "MultTree").concat(
		specificChildImports.Tree
	)
)(Tree)
