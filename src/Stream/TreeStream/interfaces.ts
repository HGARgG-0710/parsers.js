import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { InTree } from "../../Tree/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { IMultiIndex } from "../../Position/interfaces.js"

export interface ITreeStream<Type = any>
	extends Superable,
		ReversedStreamClassInstance<InTree<Type>> {
	multind: IMultiIndex
	response: string
	lastLevelWithSiblings: number
}
