import type { BasicStream } from "./BasicStream.js"

export interface RewindableStream<Type = any> extends BasicStream<Type> {
	rewind(this: RewindableStream<Type>): Type
}
