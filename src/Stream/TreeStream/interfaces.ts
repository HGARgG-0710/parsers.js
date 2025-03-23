import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IInTree } from "../../Tree/interfaces.js"
import type { ISupered } from "../../interfaces.js"
import type { MultiIndex } from "../../Position/classes.js"

export interface ITreeStream<Type = any>
	extends ISupered,
		IReversedStreamClassInstance<IInTree<Type>> {
	readonly multind: MultiIndex
}
