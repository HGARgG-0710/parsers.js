import type { BasicStream } from "./BasicStream.js"
import type { TreeStream } from "./TreeStream.js"

import type { InputStream } from "./InputStream.js"
import type { Rewindable } from "src/interfaces/Rewindable.js"
import type { ReversibleStream } from "main.js"

export interface RewindableStream<Type = any>
	extends BasicStream<Type>,
		Rewindable<Type> {}

export function inputStreamRewind<Type = any>(this: InputStream<Type>) {
	this.isStart = true
	return this.input[(this.pos = 0)]
}

export function treeStreamRewind<Type = any>(this: TreeStream<Type>) {
	this.walker.restart()
	this.isStart = true
	return this.curr
}

export function rewind(stream: ReversibleStream) {
	while (!stream.isStart) stream.prev()
}
