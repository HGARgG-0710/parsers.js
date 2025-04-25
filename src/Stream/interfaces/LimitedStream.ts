import type { IIsEndCurrable, IIsStartCurrable, IPosed } from "../interfaces.js"
import type { IOwnedStream } from "./OwnedStream.js"

export type IUnderLimitedStream<Type = any> = IOwnedStream<Type> &
	IIsEndCurrable &
	IIsStartCurrable &
	IPosed<number>
