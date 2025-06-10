import type { IPosed } from "../../../interfaces.js"
import type { IIsCurrStartable } from "../../../interfaces/Stream.js"
import type { IOwnedStream } from "./OwnedStream.js"

export type ILimitableStream<Type = any> = IOwnedStream<Type> &
	IIsCurrStartable &
	IPosed<number>
