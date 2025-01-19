import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { InTree, Tree } from "../../Tree/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { Pointer } from "../../Pattern/interfaces.js"
import type { MultiIndex } from "../../Position/interfaces.js"

export interface TreeStream<Type = any>
	extends Pointer<Tree<Type>>,
		Superable,
		ReversedStreamClassInstance<InTree<Type>> {
	multind: MultiIndex
	response: string
	lastLevelWithSiblings: number
}
