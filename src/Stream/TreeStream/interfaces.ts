import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { ISupered } from "../../interfaces.js"
import type { MultiIndex } from "../../Position/classes.js"
import type { IWalkable } from "../../Node/interfaces.js"

export interface ITreeStream<Type extends IWalkable<Type> = IWalkable>
	extends ISupered,
		IReversedStreamClassInstance<Type> {
	readonly multind: MultiIndex
}
