import type { TreeWalker } from "./TreeWalker/interfaces.js"
import type { MultiIndex } from "./MultiIndex/interfaces.js"
import type { Posed } from "../PositionalStream/interfaces.js"
import type { Rewindable } from "../StreamClass/Rewindable/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { InTreeType, Tree } from "src/Tree/interfaces.js"
import type { Copiable } from "../StreamClass/Copiable/interfaces.js"
import type { Navigable } from "../StreamClass/Navigable/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { BasicStream } from "../interfaces.js"
import type { Superable } from "../StreamClass/Superable/interfaces.js"

export interface BasicTreeStream<Type = any>
	extends BasicStream<InTreeType<Type>>,
		Posed<MultiIndex>,
		Inputted<Tree<Type>>,
		Iterable<InTreeType<Type>> {}

export interface TreeStream<Type = any>
	extends BasicTreeStream<Type>,
		ReversibleStream<InTreeType<Type>> {}

export interface EffectiveTreeStream<Type = any>
	extends BasicTreeStream<Type>,
		Superable,
		Rewindable<InTreeType<Type>>,
		Copiable<EffectiveTreeStream<Type>>,
		Navigable<InTreeType<Type>>,
		ReversedStreamClassInstance<InTreeType<Type>> {
	walker: TreeWalker<Type>
	response: string
	lastLevelWithSiblings: number
}

export * as TreeWalker from "./TreeWalker/interfaces.js"
export * as MultiIndex from "./MultiIndex/interfaces.js"
