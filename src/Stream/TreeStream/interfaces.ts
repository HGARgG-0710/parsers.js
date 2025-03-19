import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IInTree } from "../../Tree/interfaces.js"
import type { ISupered } from "src/interfaces.js"
import type { IMultiIndex } from "../../Position/interfaces.js"

export interface ITreeStream<Type = any>
	extends ISupered,
		IReversedStreamClassInstance<IInTree<Type>> {
	readonly multind: IMultiIndex
}
