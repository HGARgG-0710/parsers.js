import type { TreeWalker } from "../../Tree/TreeWalker/interfaces.js"
import type { MultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { Posed } from "../../Position/interfaces.js"
import type {
	Rewindable,
	Inputted,
	Copiable,
	Navigable,
	ReversedStreamClassInstance
} from "../StreamClass/interfaces.js"
import type { InTreeType, Tree } from "../../Tree/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { BasicStream } from "../interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"

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
