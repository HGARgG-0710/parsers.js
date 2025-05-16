import type { IIsCurrStartable, IPosed } from "../../interfaces/Stream.js"
import type { IOwnedStream } from "./OwnedStream.js"

export type ILimitableStream<Type = any> = IOwnedStream<Type> &
	IIsCurrStartable &
	IPosed<number>
