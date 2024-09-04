import type { InputStream as InputStreamType } from "../InputStream/interfaces.js"
import type { TreeStream as TreeStreamType } from "../TreeStream/interfaces.js"
import { InputStream } from "../InputStream/classes.js"
import { TreeStream } from "../TreeStream/classes.js"

export function inputStreamCopy<Type = any>(this: InputStreamType<Type>) {
	const inputStream = InputStream(this.input)
	inputStream.pos = this.pos
	return inputStream
}

export function treeStreamCopy<Type = any>(this: TreeStreamType<Type>) {
	const copied = TreeStream(this.input)
	copied.navigate(this.pos)
	return copied
}
