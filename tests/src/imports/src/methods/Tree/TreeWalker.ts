import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as TreeWalker from "../../../../../../dist/src/Tree/TreeWalker/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("treeWalker")(
			...namesCapitalized(
				"renewLevel",
				"popFirstChild",
				"popChild",
				"isSibilngAfter",
				"isSibilngBefore",
				"goSiblingAfter",
				"goSiblingBefore",
				"indexCut",
				"currentLastIndex",
				"isParent",
				"isChild",
				"lastLevelWithSiblings",
				"goPrevLast",
				"restart",
				"goIndex",
				"initialize"
			)
		)
	)
)(TreeWalker)
