import type { InTreeType, Tree } from "../Tree.js"
import { treeStreamCopy, type CopiableStream } from "./CopiableStream.js"
import { treeStreamPrev, type ReversibleStream } from "./ReversibleStream.js"
import { treeStreamIsStartGetter } from "./StartedStream.js"
import { treeStreamRewind, type RewindableStream } from "./RewindableStream.js"

import { treeStreamNavigate, type NavigableStream } from "./NavigableStream.js"
import type { PositionalStream } from "./PositionalStream.js"
import { type Inputted } from "src/interfaces/Inputted.js"
import { treeStreamNext } from "./BasicStream.js"
import { TreeWalker } from "./TreeStream/TreeWalker.js"

import type { MultiIndex } from "./TreeStream/MultiIndex.js"
import { MultiIndex as MultiIndexConstructor } from "./TreeStream/MultiIndex/MultiIndex.js"
import { streamIterator, type IterableStream } from "./IterableStream.js"
import { BackwardStreamIterationHandler } from "main.js"
import type { IsStartCurrable } from "src/interfaces/BoundCheckable.js"
import type { BasePrevable } from "src/interfaces/BaseIterable.js"

export interface TreeStream<Type = any>
	extends RewindableStream<InTreeType<Type>>,
		ReversibleStream<InTreeType<Type>>,
		CopiableStream<InTreeType<Type>>,
		NavigableStream<InTreeType<Type>>,
		PositionalStream<InTreeType<Type>, MultiIndex>,
		Inputted<Tree<Type>>,
		IterableStream<InTreeType<Type>>,
		IsStartCurrable,
		BasePrevable<Type> {
	walker: TreeWalker<Type>
}

export function TreeStream<Type = any>(tree: Tree<Type>): TreeStream<Type> {
	const T: TreeStream<Type> = {
		input: tree,
		curr: tree,
		isEnd: false,
		pos: MultiIndexConstructor([]),
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

export * from "./TreeStream/MultiIndex.js"
export * from "./TreeStream/TreeWalker.js"
