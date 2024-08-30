import type { BasicStream } from "./BasicStream.js"
import type { TreeStream } from "./TreeStream.js"

import { object, typeof as type } from "@hgargg-0710/one"
import type { InputStream } from "main.js"
const { structCheck } = object
const { isFunction } = type

export interface RewindableStream<Type = any> extends BasicStream<Type> {
	rewind(this: RewindableStream<Type>): Type
}

export function inputStreamRewind<Type = any>(this: InputStream<Type>) {
	this.isStart = true
	return this.input[(this.pos = 0)]
}

export function treeStreamRewind<Type = any>(this: TreeStream<Type>) {
	this.walker.restart()
	this.isStart = true
	return this.curr
}

const checkRewind = structCheck("rewind")
export function isRewindableStream(stream: BasicStream): stream is RewindableStream {
	return checkRewind(stream) && isFunction(stream.rewind)
}
