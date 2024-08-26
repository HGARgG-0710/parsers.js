import { isFunction } from "src/misc.js"
import type { BasicStream } from "./BasicStream.js"
import type { TreeStream } from "./TreeStream.js"

import { object } from "@hgargg-0710/one"
const { structCheck } = object

// ! BUG: after a '.rewind', the '.isStart' becomes 'true' STILL (even though, it's not supposed to be anymore...);
// ! THE 'InputStream' and other 'Stream'-s '.isStart' IS NOT YET FIXED with StreamStartHandler! [do it...]:
export interface RewindableStream<Type = any> extends BasicStream<Type> {
	rewind(this: RewindableStream<Type>): Type
}

export function inputStreamRewind() {
	this.isStart = true
	return this.input[(this.pos = 0)]
}

export function treeStreamRewind<Type = any>(this: TreeStream<Type>) {
	this.walker.restart()
	this.isStart = true
	return this.curr()
}

const checkRewind = structCheck("rewind")
export function isRewindableStream(stream: BasicStream) {
	return checkRewind(stream) && isFunction(stream.rewind)
}
