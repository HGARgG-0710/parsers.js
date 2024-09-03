import type { BasicStream, InputStream, TreeStream } from "main.js"
import type { Started } from "src/interfaces/Started.js"

export interface StartedStream<Type = any> extends BasicStream<Type>, Started {}

export function inputStreamIsStartGetter<Type = any>(this: InputStream<Type>) {
	return !this.pos
}

export function treeStreamIsStartGetter<Type = any>(this: TreeStream<Type>) {
	return !this.walker.isParent()
}
