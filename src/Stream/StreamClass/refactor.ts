import type { Summat } from "@hgargg-0710/summat.ts"
import type { Endable } from "../interfaces.js"
import type {
	PositionalBufferizedStreamClassInstance,
	PreStarted,
	Stateful,
	StreamClassInstance
} from "./interfaces.js"

import { valueDelegate, valuePropDelegate } from "src/refactor.js"

import { Stream } from "../../constants.js"
const { StreamClass } = Stream

export const valueIsCurrEnd = valueDelegate("isCurrEnd")
export const valueCurr = valuePropDelegate("curr")

const calledDelegate =
	(delegatePropName: string) =>
	(delegateMethodName: string) =>
	(called: any, ...delegateArgs: any[]) =>
		called[delegatePropName][delegateMethodName].call(called, ...delegateArgs)

const superDelegate = calledDelegate("super")
export const superInit = superDelegate("init")

export function start(stream: PreStarted) {
	stream.isStart = StreamClass.PostCurrInit
}

export function deStart(stream: StreamClassInstance) {
	stream.isStart = StreamClass.PostStart
}

export function end(stream: StreamClassInstance) {
	stream.isEnd = true
}

export function deEnd(stream: Endable) {
	stream.isEnd = false
}

export function createState(x: Stateful, state: Summat) {
	x.state = state
}

export function readBuffer<Type = any>(
	stream: PositionalBufferizedStreamClassInstance<Type>
) {
	return (stream.curr = stream.buffer.read(stream.pos))
}

import curr from "./methods/curr.js"
export { curr }

export * as init from "./methods/init.js"
export * as iter from "./methods/iter.js"
export * as finish from "./methods/finish.js"
export * as rewind from "./methods/rewind.js"
export * as navigate from "./methods/navigate.js"
