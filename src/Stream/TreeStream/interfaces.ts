import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IPointer, IPosed } from "../../interfaces.js"
import type { MultiIndex } from "../Position/classes.js"
import type { IWalkable } from "../../Node/interfaces.js"

export type ITreeStreamInitSignature<
	TreeLike extends IWalkable<TreeLike> = IWalkable
> = [TreeLike?]

export type ITreeStream<TreeLike extends IWalkable<TreeLike> = IWalkable> =
	IReversedStreamClassInstance<
		TreeLike,
		TreeLike,
		MultiIndex<TreeLike>,
		ITreeStreamInitSignature<TreeLike>
	> &
		IPosed<MultiIndex> &
		IPointer<TreeLike>
