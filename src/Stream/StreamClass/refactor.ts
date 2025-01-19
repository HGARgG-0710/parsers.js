import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream, Endable } from "../interfaces.js"
import type {
	BufferizedStreamClassInstance,
	PositionalStreamClassInstance,
	PreStarted,
	ReversedStreamClassInstance,
	Stateful,
	StreamClassInstance
} from "./interfaces.js"

import { valueDelegate, valuePropDelegate } from "src/refactor.js"

import { Stream, defaults } from "../../constants.js"
const { StreamClass } = Stream
const { realCurr: defaultRealCurr } = defaults.StreamClass

export function* streamIterator<Type = any>(this: BasicStream<Type>) {
	while (!this.isEnd) yield this.next()
}

export const valueIsCurrEnd = valueDelegate("isCurrEnd")
export const valueCurr = valuePropDelegate("curr")

const calledDelegate =
	(delegatePropName: string) =>
	(delegateMethodName: string) =>
	(called: any, ...delegateArgs: any[]) =>
		called[delegatePropName][delegateMethodName].call(called, ...delegateArgs)

export const superDelegate = calledDelegate("super")
export const superInit = superDelegate("init")

export function initCurr<Type = any>(stream: StreamClassInstance<Type>) {
	start(stream)
	return (stream.realCurr = stream.initGetter!())
}

export function isCurrUninitialized<Type = any>(stream: StreamClassInstance<Type>) {
	return stream.isStart === StreamClass.PreCurrInit
}

export function preStart(stream: PreStarted) {
	stream.isStart = StreamClass.PreCurrInit
}

export function start(stream: PreStarted) {
	stream.isStart = StreamClass.PostCurrInit
}

export function deStart(stream: StreamClassInstance) {
	stream.isStart = StreamClass.PostStart
}

export function preEnd(stream: StreamClassInstance) {
	stream.isEnd = stream.defaultIsEnd()
}

export function end(stream: StreamClassInstance) {
	stream.isEnd = true
}

// * Explanation: For 'StreamClassInstance'-s, it's a call to the 'initGetter', or a first call to 'currGetter'
export function preInit(x: BasicStream) {
	if (!x.isEnd) x.curr
}

export function createState(x: Stateful, state: Summat) {
	x.state = state
}

export function realCurr(stream: StreamClassInstance) {
	stream.realCurr = defaultRealCurr
}

export function getNext<Type = any>(stream: StreamClassInstance<Type>) {
	return (stream.curr = stream.baseNextIter())
}

export function readBuffer<Type = any>(
	stream: BufferizedStreamClassInstance<Type> & PositionalStreamClassInstance<Type>
) {
	return (stream.curr = stream.buffer.read(stream.pos))
}

export function getPrev<Type = any>(stream: ReversedStreamClassInstance<Type>) {
	return (stream.curr = stream.basePrevIter())
}

export function deEnd(stream: Endable) {
	stream.isEnd = false
}

export * as curr from "./methods/curr.js"
export * as init from "./methods/init.js"
export * as next from "./methods/next.js"
export * as prev from "./methods/prev.js"
export * as finish from "./methods/finish.js"
export * as rewind from "./methods/rewind.js"
export * as navigate from "./methods/navigate.js"
