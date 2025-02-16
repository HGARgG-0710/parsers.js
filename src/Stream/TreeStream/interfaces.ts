import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { InTree } from "../../Tree/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { MultiIndex } from "../../Position/interfaces.js"

export interface TreeStream<Type = any>
	extends Superable,
		ReversedStreamClassInstance<InTree<Type>> {
	multind: MultiIndex
	response: string
	lastLevelWithSiblings: number
}
