import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { ISupered } from "../../interfaces.js"
import type { MultiIndex } from "../../Position/classes.js"
import type { IWalkable } from "../../Node/interfaces.js"

export interface ITreeStream
	extends ISupered,
		IReversedStreamClassInstance<IWalkable> {
	readonly multind: MultiIndex
}
