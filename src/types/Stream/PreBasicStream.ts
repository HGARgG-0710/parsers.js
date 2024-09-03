import type { InputStream } from "./InputStream.js"
import type { StreamTokenizer } from "src/parsers/StreamTokenizer.js"
import type { Currable } from "src/interfaces/Currable.js"
import type { Endable } from "src/interfaces.js"

export interface PreBasicStream<Type = any> extends Endable, Currable<Type> {}

export function inputStreamCurr<Type = any>(this: InputStream<Type>) {
	return this.input[this.pos]
}

export function streamTokenizerCurrGetter<Type = any>(this: StreamTokenizer<Type>) {
	this.isStart = false
	return (this.curr = this.next())
}
