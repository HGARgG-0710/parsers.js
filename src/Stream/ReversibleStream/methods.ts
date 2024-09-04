import type { InputStream } from "main.js"
import type { InputStream } from "../InputStream/interfaces.js"
import type { TreeStream } from "../TreeStream/interfaces.js"

export function inputStreamIsStartGetter<Type = any>(this: InputStream<Type>) {
	return !this.pos
}

export function treeStreamIsStartGetter<Type = any>(this: TreeStream<Type>) {
	return !this.walker.isParent()
}export function inputStreamPrev<Type = any>(this: InputStream<Type>) {
	return this.input[--this.pos]
}
export function treeStreamPrev<Type = any>(this: TreeStream<Type>) {
	const { walker } = this
	this.isEnd = false
	if (walker.isSiblingBefore()) walker.goPrevLast()
	else if (walker.isParent()) walker.popChild()
	return this.curr
}

