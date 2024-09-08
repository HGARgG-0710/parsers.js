import { treeStreamInitCurr, treeStreamIsEnd, treeStreamPrev } from "./methods.js"
import { TreeWalker } from "./TreeWalker/classes.js"
import { treeStreamRewind } from "./methods.js"
import { MultiIndex } from "./MultiIndex/classes.js"
import { StreamClass } from "../StreamClass/classes.js"
import type { Tree } from "../../Tree/interfaces.js"
import { treeStreamNext } from "./methods.js"
import { treeStreamCopy } from "./methods.js"
import { streamIterator } from "../IterableStream/methods.js"
import { treeStreamNavigate } from "./methods.js"
import { treeStreamIsStart } from "./methods.js"
import type { TreeStream } from "./interfaces.js"
import { Inputted } from "../UnderStream/classes.js"

export const TreeStreamClass = StreamClass({
	initGetter: treeStreamInitCurr,
	baseNextIter: treeStreamNext,
	basePrevIter: treeStreamPrev,
	isCurrEnd: treeStreamIsEnd,
	isCurrStart: treeStreamIsStart
})

export function TreeStream<Type = any>(tree: Tree<Type>): TreeStream<Type> {
	const result = Inputted(TreeStreamClass(), tree) as TreeStream<Type>
	result.pos = MultiIndex([])
	result.rewind = treeStreamRewind<Type>
	result.copy = treeStreamCopy<Type>
	result.navigate = treeStreamNavigate<Type>
	result[Symbol.iterator] = streamIterator<Type>
	result.walker = TreeWalker(result)
	return result
}

export * as TreeWalker from "./TreeWalker/classes.js"
export * as MultiIndex from "./MultiIndex/classes.js"
