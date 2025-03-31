import type { Summat } from "@hgargg-0710/summat.ts"

import type { IStarted } from "../interfaces.js"
import type { IStreamClassInstance } from "./interfaces.js"
import type { IStateful } from "src/interfaces.js"
import type { IBufferized } from "../../Collection/Buffer/interfaces.js"
import type { IPosed } from "../Position/interfaces.js"

import { valueDelegate, valuePropDelegate } from "../../refactor.js"

import curr from "./methods/curr.js"

export type IConstructor<Signature extends any[], Type = any> = new (
	...x: Signature
) => Type

export const valueIsCurrEnd = valueDelegate("isCurrEnd")
export const valueCurr = valuePropDelegate("curr")

export function start(stream: IStarted) {
	stream.isStart = true
}

export function deStart(stream: IStarted) {
	stream.isStart = false
}

export function end(stream: IStreamClassInstance) {
	stream.isEnd = true
}

export function deEnd(stream: IStreamClassInstance) {
	stream.isEnd = false
}

export function createState(x: IStateful, state: Summat) {
	;(x.state as Summat) = state
}

export function readBuffer<Type = any>(
	stream: IStreamClassInstance<Type> & IBufferized<Type> & IPosed<number>
) {
	return (stream.curr = stream.buffer.read(stream.pos))
}

export function readBufferThis<Type = any>(
	stream: IStreamClassInstance<Type> & IPosed<number> & IBufferized<Type>
) {
	readBuffer(stream)
	return stream
}

export { curr }

export * as init from "./methods/init.js"
export * as iter from "./methods/iter.js"
export * as finish from "./methods/finish.js"
export * as rewind from "./methods/rewind.js"
export * as navigate from "./methods/navigate.js"
export * as copy from "./methods/copy.js"
