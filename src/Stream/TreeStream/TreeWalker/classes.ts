import type { TreeStream } from "../interfaces.js"
import type { TreeWalker } from "./interfaces.js"
import {
	treeWalkerPushFirstChild,
	treeWalkerPopChild,
	treeWalkerIsSiblingAfter,
	treeWalkerIsSiblingBefore,
	treeWalkerGoSiblingAfter,
	treeWalkerGoSiblingBefore,
	treeWalkerIndexCut,
	treeWalkerIsChild,
	treeWalkerIsParent,
	treeWalkerLastLevelWithSiblings,
	treeWalkerCurrentLastIndex,
	treeWalkerGoPrevLast,
	treeWalkerRenewLevel,
	treeWalkerRestart,
	treeWalkerGoIndex
} from "./methods.js"

// ! LATER, when implementing the 'TreeModifier', one'll NEED A WAY TO NOTIFY THE TreeWalker of CHANGES IN THE 'Tree'!
export function TreeWalker<Type = any>(treeStream: TreeStream<Type>): TreeWalker<Type> {
	const root = treeStream.input
	return {
		stream: treeStream,
		level: root,
		pushFirstChild: treeWalkerPushFirstChild<Type>,
		popChild: treeWalkerPopChild<Type>,
		isSiblingAfter: treeWalkerIsSiblingAfter<Type>,
		isSiblingBefore: treeWalkerIsSiblingBefore<Type>,
		goSiblingAfter: treeWalkerGoSiblingAfter<Type>,
		goSiblingBefore: treeWalkerGoSiblingBefore<Type>,
		indexCut: treeWalkerIndexCut<Type>,
		isChild: treeWalkerIsChild<Type>,
		isParent: treeWalkerIsParent<Type>,
		lastLevelWithSiblings: treeWalkerLastLevelWithSiblings<Type>,
		currentLastIndex: treeWalkerCurrentLastIndex<Type>,
		goPrevLast: treeWalkerGoPrevLast<Type>,
		renewLevel: treeWalkerRenewLevel<Type>,
		restart: treeWalkerRestart<Type>,
		goIndex: treeWalkerGoIndex<Type>
	}
}
