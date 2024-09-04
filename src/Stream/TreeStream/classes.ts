import { treeStreamPrev } from "../ReversibleStream/methods.js"
import { TreeWalker } from "./TreeWalker/classes.js"
import { treeStreamRewind } from "../RewindableStream/methods.js"
import { MultiIndex } from "./MultiIndex/classes.js"
import { BackwardStreamIterationHandler } from "../IterationHandler/classes.js"
import type { Tree } from "../../Tree/interfaces.js"
import { treeStreamNext } from "../BasicStream/methods.js"
import { treeStreamCopy } from "../CopiableStream/methods.js"
import { streamIterator } from "../IterableStream/methods.js"
import { treeStreamNavigate } from "../NavigableStream/methods.js"
import { treeStreamIsStartGetter } from "../ReversibleStream/methods.js"
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
