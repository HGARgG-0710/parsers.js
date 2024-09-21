import type { TreeWalker } from "./TreeWalker/interfaces.js"
import type { MultiIndex } from "./MultiIndex/interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { RewindableStream } from "../RewindableStream/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { InTreeType, Tree } from "src/Tree/interfaces.js"
import type { CopiableStream } from "../CopiableStream/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"
import type { NavigableStream } from "../NavigableStream/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"

export interface BasicTreeStream<Type = any>
	extends PositionalStream<InTreeType<Type>, MultiIndex>,
		Inputted<Tree<Type>>,
		IterableStream<InTreeType<Type>> {}

export interface TreeStream<Type = any>
	extends BasicTreeStream<Type>,
		ReversibleStream<InTreeType<Type>> {}

export interface EffectiveTreeStream<Type = any>
	extends BasicTreeStream<Type>,
		RewindableStream<InTreeType<Type>>,
		CopiableStream<InTreeType<Type>>,
		NavigableStream<InTreeType<Type>>,
		ReversedStreamClassInstance<InTreeType<Type>> {
	walker: TreeWalker<Type>
	response: string
	lastLevelWithSiblings: number
}

export * as TreeWalker from "./TreeWalker/interfaces.js"
export * as MultiIndex from "./MultiIndex/interfaces.js"
