import { InputStream, TreeStream } from "_src/types.js"

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
