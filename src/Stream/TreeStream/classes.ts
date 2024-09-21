import type { EffectiveTreeStream } from "./interfaces.js"
import {
	treeStreamInitCurr,
	effectiveTreeStreamIsEnd,
	effectiveTreeStreamPrev,
	effectiveTreeStreamRewind,
	effectiveTreeStreamNext,
	effectiveTreeStreamCopy,
	effectiveTreeStreamNavigate,
	effectiveTreeStreamIsStart
} from "./methods.js"

import { TreeWalker } from "./TreeWalker/classes.js"
import { MultiIndex } from "./MultiIndex/classes.js"
import { StreamClass } from "../StreamClass/classes.js"
import type { Tree } from "../../Tree/interfaces.js"
import { streamIterator } from "../IterableStream/methods.js"
import { Inputted } from "../UnderStream/classes.js"

import { boolean } from "@hgargg-0710/one"
const { F } = boolean

export const TreeStreamClass = StreamClass({
	initGetter: treeStreamInitCurr,
	baseNextIter: effectiveTreeStreamNext,
	basePrevIter: effectiveTreeStreamPrev,
	isCurrEnd: effectiveTreeStreamIsEnd,
	isCurrStart: effectiveTreeStreamIsStart,
	defaultIsEnd: F
})

export function TreeStream<Type = any>(tree: Tree<Type>): EffectiveTreeStream<Type> {
	const result = Inputted(TreeStreamClass(), tree) as EffectiveTreeStream<Type>
	result.pos = MultiIndex([])
	result.rewind = effectiveTreeStreamRewind<Type>
	result.copy = effectiveTreeStreamCopy<Type>
	result.navigate = effectiveTreeStreamNavigate<Type>
	result[Symbol.iterator] = streamIterator<Type>
	result.walker = TreeWalker(result)
	return result
}

export * as TreeWalker from "./TreeWalker/classes.js"
export * as MultiIndex from "./MultiIndex/classes.js"
