import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IPosed } from "../../interfaces.js"
import type { MultiIndex } from "../Position/classes.js"
import type { IWalkable } from "../../Node/interfaces.js"

export type ITreeStream<TreeLike extends IWalkable<TreeLike> = IWalkable> =
	IReversedStreamClassInstance<TreeLike, any, MultiIndex<TreeLike>> &
		IPosed<MultiIndex> & {
			init: (walkable?: TreeLike) => ITreeStream<TreeLike>
		}
