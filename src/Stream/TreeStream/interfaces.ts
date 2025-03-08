import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { InTree } from "../../Tree/interfaces.js"
import type { Supered } from "src/interfaces.js"
import type { IMultiIndex } from "../../Position/interfaces.js"

export interface ITreeStream<Type = any>
	extends Supered,
		ReversedStreamClassInstance<InTree<Type>> {
	readonly multind: IMultiIndex
}
