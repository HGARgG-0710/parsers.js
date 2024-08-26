import type { Tree } from "../Tree.js"
import { treeStreamCopy, type CopiableStream } from "./CopiableStream.js"
import {
	treeStreamIsStartGetter,
	treeStreamPrev,
	type ReversibleStream
} from "./ReversibleStream.js"
import { treeStreamRewind, type RewindableStream } from "./RewindableStream.js"

import { treeStreamNavigate, type NavigableStream } from "./NavigableStream.js"
import type { PositionalStream } from "./PositionalStream.js"
import { type Inputted } from "./BasicStream.js"
import { treeStreamNext } from "./PreBasicStream.js"
import { TreeWalker } from "./TreeStream/TreeWalker.js"
import { treeStreamCurr } from "./PreBasicStream.js"

import type { MultiIndex } from "./TreeStream/MultiIndex.js"
import { MultiIndex as MultiIndexConstructor } from "./TreeStream/MultiIndex/MultiIndex.js"

export interface TreeStream<Type = any>
	extends RewindableStream<Type | Tree<Type>>,
		ReversibleStream<Type | Tree<Type>>,
		CopiableStream<Type | Tree<Type>>,
		NavigableStream<Type | Tree<Type>>,
		PositionalStream<Type | Tree<Type>, MultiIndex>,
		Inputted<Tree<Type>> {
	walker: TreeWalker<Type>
}

export function TreeStream<Type = any>(tree: Tree<Type>): TreeStream<Type> {
	const T: TreeStream<Type> = {
		input: tree,
		pos: MultiIndexConstructor([]),
		next: treeStreamNext<Type>,
		prev: treeStreamPrev<Type>,
		curr: treeStreamCurr<Type>,
		isEnd: false,
		rewind: treeStreamRewind<Type>,
		copy: treeStreamCopy<Type>,
		navigate: treeStreamNavigate<Type>
	} as unknown as TreeStream<Type>
	T.walker = TreeWalker(T)
	return Object.defineProperty<
		RewindableStream<Type | Tree<Type>> &
			CopiableStream<Type | Tree<Type>> &
			NavigableStream<Type | Tree<Type>> &
			PositionalStream<Type | Tree<Type>, MultiIndex>
	>(T, "isStart", { get: treeStreamIsStartGetter<Type> }) as TreeStream<Type>
}

export * from "./TreeStream/MultiIndex.js"
export * from "./TreeStream/TreeWalker.js"
