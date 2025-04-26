import type { IIsEndCurrable } from "../interfaces.js"
import type { IOwnedStream } from "./OwnedStream.js"

export type IUnderStreamParser<Type = any> = IIsEndCurrable & IOwnedStream<Type>
export type IStreamParser<Type = any> = IOwnedStream<Type> & IIsEndCurrable
