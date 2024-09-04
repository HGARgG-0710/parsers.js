import type { InputStream } from "../InputStream/interfaces.js"
import type { TreeStream } from "../TreeStream/interfaces.js"

export function inputStreamRewind<Type = any>(this: InputStream<Type>) {
	this.isStart = true
	return this.input[(this.pos = 0)]
}

export function treeStreamRewind<Type = any>(this: TreeStream<Type>) {
	this.walker.restart()
	this.isStart = true
	return this.curr
}
