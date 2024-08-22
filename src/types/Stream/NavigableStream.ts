import type { BasicStream } from "./BasicStream.js"
import type { Position } from "./Position.js"

export interface NavigableStream<Type = any> extends BasicStream<Type> {
	navigate(position: Position): Type | void
}
