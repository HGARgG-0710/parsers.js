import type { InputStream } from "_src/types.js"
import type { StreamTokenizer } from "src/parsers/StreamTokenizer.js"
import type { BaseNestedStream } from "../NestedStream/interfaces.js"
import { positionCheck } from "../PositionalStream/Position/utils.js"

export function inputStreamCurr<Type = any>(this: InputStream<Type>) {
	return this.input[this.pos]
}

export function streamTokenizerCurrGetter<Type = any>(this: StreamTokenizer<Type>) {
	this.isStart = false
	return (this.curr = this.next())
}
export function inputStreamIsEnd<Type = any>(this: InputStream<Type>) {
	return this.pos >= this.input.length - 1;
}

export function limitedStreamIsEnd<Type = any>(this: LimitedStream<Type>) {
	return this.input.isCurrEnd() || !positionCheck(this.input, this.to);
}

export function streamTokenizerIsEnd<Type = any>(this: StreamTokenizer<Type>) {
	return !this.curr;
}

export function baseNestedStreamIsEnd<Type = any>(this: BaseNestedStream<Type>) {
	return !!this.deflate() || this.input.isCurrEnd();
}
