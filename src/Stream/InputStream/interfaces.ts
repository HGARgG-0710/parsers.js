import type { IBufferized } from "../../Collection/Sequence/interfaces.js"
import type { IReversibleStream } from "../interfaces.js"
import type { IPosed } from "../Position/interfaces.js"
import type {
	IBufferizedStreamClassInitSignature,
	IReversedStreamClassInstance
} from "../StreamClass/interfaces.js"

export type IInputStream<Type = any> = IReversibleStream<
	Type,
	number,
	IBufferizedStreamClassInitSignature<Type>
> &
	IPosed<number> &
	IBufferized<Type>

export type IConcreteInputStream<Type = any> = IInputStream<Type> &
	IReversedStreamClassInstance<
		Type,
		any,
		number,
		IBufferizedStreamClassInitSignature<Type>
	> &
	IPosed<number> &
	IBufferized<Type>
