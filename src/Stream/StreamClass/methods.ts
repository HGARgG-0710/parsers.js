import type { BasicStream } from "../interfaces.js"

import { delegate, delegateProperty } from "../../utils.js"

export function* streamIterator<Type = any>(this: BasicStream<Type>) {
	while (!this.isEnd) yield this.next()
}

export const [inputDelegate, inputPropDelegate] = [delegate, delegateProperty].map((x) =>
	x("input")
)

export const [inputPrev, inputNext, inputIsEnd, inputIsStart, inputRewind, inputFinish] =
	["prev", "next", "isCurrEnd", "isCurrStart", "rewind", "finish"].map(inputDelegate)

export const [inputCurr, inputDefaultIsEnd, inputDefaultIsStart] = [
	"curr",
	"isEnd",
	"isStart"
].map(inputPropDelegate)

export * as curr from "./methods/curr.js"
export * as init from "./methods/init.js"
export * as next from "./methods/next.js"
export * as prev from "./methods/prev.js"
export * as finish from "./methods/finish.js"
export * as rewind from "./methods/rewind.js"
export * as navigate from "./methods/navigate.js"
