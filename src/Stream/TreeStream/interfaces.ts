import type { TreeWalker } from "../../Tree/TreeWalker/interfaces.js"
import type {
	Copiable,
	ReversedStreamClassInstance,
	Inputted
} from "../StreamClass/interfaces.js"
import type { InTreeType, Tree } from "../../Tree/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { BasicStream } from "../interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"

export interface BasicTreeStream<Type = any>
	extends BasicStream<InTreeType<Type>>,
		Inputted<Tree<Type>> {}

export interface TreeStream<Type = any>
	extends BasicTreeStream<Type>,
		ReversibleStream<InTreeType<Type>> {}

export interface EffectiveTreeStream<Type = any>
	extends BasicTreeStream<Type>,
		Superable,
		Copiable<EffectiveTreeStream<Type>>,
		ReversedStreamClassInstance<InTreeType<Type>> {
	walker: TreeWalker<Type>
	response: string
	lastLevelWithSiblings: number
}
