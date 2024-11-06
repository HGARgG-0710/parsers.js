import type { TreeWalker } from "../../Tree/TreeWalker/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { InTreeType, Tree } from "../../Tree/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { BasicStream } from "../interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { Pattern } from "src/Pattern/interfaces.js"

export interface BasicTreeStream<Type = any>
	extends BasicStream<InTreeType<Type>>,
		Pattern<Tree<Type>> {}

export interface TreeStream<Type = any>
	extends BasicTreeStream<Type>,
		ReversibleStream<InTreeType<Type>> {}

export interface EffectiveTreeStream<Type = any>
	extends BasicTreeStream<Type>,
		Superable,
		ReversedStreamClassInstance<InTreeType<Type>> {
	walker: TreeWalker<Type>
	response: string
	lastLevelWithSiblings: number
}
