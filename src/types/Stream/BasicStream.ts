import type { Summat } from "./../Summat.js"
import type { PreBasicStream } from "./PreBasicStream.js"
import { positionCheck } from "./Position.js"

export interface BasicStream<Type = any> extends PreBasicStream<Type> {
	isEnd: boolean
}

export interface Inputted<Type = any> extends Summat {
	input: Type
}

export function inputStreamIsEnd() {
	return this.pos >= this.input.length
}

export function limitedStreamIsEnd() {
	return this.input.isEnd || !positionCheck(this.input, this.to)
}
