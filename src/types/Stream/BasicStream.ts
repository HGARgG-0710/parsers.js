import type { Summat } from "@hgargg-0710/summat.ts"
import type { PreBasicStream } from "./PreBasicStream.js"
import { positionCheck } from "./Position.js"
import type { InputStream } from "./InputStream.js"
import type { LimitedStream } from "./LimitedStream.js"

export interface BasicStream<Type = any> extends PreBasicStream<Type> {
	isEnd: boolean
}

export interface Inputted<Type = any> extends Summat {
	input: Type
}

export function inputStreamIsEnd<Type = any>(this: InputStream<Type>) {
	return this.pos >= this.input.length
}

export function limitedStreamIsEnd<Type = any>(this: LimitedStream<Type>) {
	return this.input.isEnd || !positionCheck(this.input, this.to)
}
