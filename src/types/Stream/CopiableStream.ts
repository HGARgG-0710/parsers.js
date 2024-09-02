import type { Copiable } from "src/interfaces/Copiable.js"
import type { BasicStream } from "./BasicStream.js"
import { InputStream } from "./InputStream.js"
import { TreeStream } from "./TreeStream.js"

export interface CopiableStream<Type = any>
	extends BasicStream<Type>,
		Copiable<BasicStream<Type>> {}

export function inputStreamCopy<Type = any>(this: InputStream<Type>) {
	const inputStream = InputStream(this.input)
	inputStream.pos = this.pos
	return inputStream
}

export function treeStreamCopy<Type = any>(this: TreeStream<Type>) {
	const copied = TreeStream(this.input)
	copied.navigate(this.pos)
	return copied
}
