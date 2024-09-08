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

export interface TreeStream<Type = any>
	extends RewindableStream<InTreeType<Type>>,
		CopiableStream<InTreeType<Type>>,
		NavigableStream<InTreeType<Type>>,
		PositionalStream<InTreeType<Type>, MultiIndex>,
		Inputted<Tree<Type>>,
		IterableStream<InTreeType<Type>>,
		ReversedStreamClassInstance<InTreeType<Type>> {
	walker: TreeWalker<Type>, 
	response: string, 
	lastLevelWithSiblings: number
}

export * as TreeWalker from "./TreeWalker/interfaces.js"
export * as MultiIndex from "./MultiIndex/interfaces.js"
