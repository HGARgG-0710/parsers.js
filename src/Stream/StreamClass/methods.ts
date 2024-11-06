import type { BasicStream } from "../interfaces.js"

export function* streamIterator<Type = any>(this: BasicStream<Type>) {
	while (!this.isEnd) yield this.next()
}

export * as curr from "./methods/curr.js"
export * as init from "./methods/init.js"
export * as next from "./methods/next.js"
export * as prev from "./methods/prev.js"
export * as finish from "./methods/finish.js"
export * as rewind from "./methods/rewind.js"
export * as navigate from "./methods/navigate.js"
