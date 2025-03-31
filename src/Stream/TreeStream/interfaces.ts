import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IPosed } from "../../interfaces.js"
import type { MultiIndex } from "../Position/classes.js"
import type { IWalkable } from "../../Node/interfaces.js"

export type ITreeStream<Type extends IWalkable<Type> = IWalkable> =
	IReversedStreamClassInstance<Type, any, MultiIndex> & IPosed<MultiIndex>
