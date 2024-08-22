import type { BasicStream } from "./BasicStream.js"

export interface CopiableStream<Type = any> extends BasicStream<Type> {
	copy(this: CopiableStream<Type>): BasicStream<Type>
}
