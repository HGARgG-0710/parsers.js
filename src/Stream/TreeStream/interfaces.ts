import type { TreeWalker } from "../../Tree/TreeWalker/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { InTreeType, Tree } from "../../Tree/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export interface TreeStream<Type = any>
	extends Pattern<Tree<Type>>,
		Superable,
		ReversedStreamClassInstance<InTreeType<Type>> {
	walker: TreeWalker<Type>
	response: string
	lastLevelWithSiblings: number
}
