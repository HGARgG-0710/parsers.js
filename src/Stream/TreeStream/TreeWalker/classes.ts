import type { EffectiveTreeStream } from "../interfaces.js"
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

export function TreeWalker<Type = any>(
	treeStream: EffectiveTreeStream<Type>
): TreeWalker<Type> {
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
