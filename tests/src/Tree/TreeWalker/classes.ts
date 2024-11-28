import { ChildrenTree, TreeWalker } from "../../../../dist/src/Tree/classes.js"
import { TreeWalkerClassTest } from "./lib/classes.js"

// * TreeWalker

// tODO: one needs a NEW test for EACH new level 

TreeWalkerClassTest("TreeWalker", TreeWalker, [
	{
		treeInput: [ChildrenTree("children")({ children: [] })],
		pushTests: [],
		popTests: [],
		isSiblingAfterTests: [],
		isSiblingBeforeTests: [],
		goSiblingAfterTests: [],
		goSiblingBeforeTests: [],
		indexCutTests: [],
		isChildTests: [],
		isParentTests: [],
		lastLevelWithSiblingsTests: [],
		currentLastIndexTests: [],
		goPrevLastTests: [],
		renewLevelTests: [],
		restartTests: [],
		goIndexTests: [],
		initTests: []
	}
])
