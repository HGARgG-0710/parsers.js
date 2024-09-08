import { treeStreamPrev } from "./methods.js"
import { TreeWalker } from "./TreeWalker/classes.js"
import { treeStreamRewind } from "./methods.js"
import { MultiIndex } from "./MultiIndex/classes.js"
import { BackwardStreamIterationHandler } from "../StreamClass/classes.js"
import type { Tree } from "../../Tree/interfaces.js"
import { treeStreamNext } from "./methods.js"
import { treeStreamCopy } from "./methods.js"
import { streamIterator } from "../IterableStream/methods.js"
import { treeStreamNavigate } from "./methods.js"
import { treeStreamIsStartGetter } from "./methods.js"
import type { TreeStream } from "./interfaces.js"

export function TreeStream<Type = any>(tree: Tree<Type>): TreeStream<Type> {
	const T: TreeStream<Type> = {
		input: tree,
		curr: tree,
		isEnd: false,
		pos: MultiIndex([]),
		next: treeStreamNext<Type>,
		rewind: treeStreamRewind<Type>,
		copy: treeStreamCopy<Type>,
		navigate: treeStreamNavigate<Type>,
		[Symbol.iterator]: streamIterator<Type>
	} as unknown as TreeStream<Type>
	T.walker = TreeWalker(T)
	return BackwardStreamIterationHandler(
		T,
		treeStreamPrev<Type>,
		treeStreamIsStartGetter<Type>
	) as TreeStream<Type>
}

export * as TreeWalker from "./TreeWalker/classes.js"
export * as MultiIndex from "./MultiIndex/classes.js"
