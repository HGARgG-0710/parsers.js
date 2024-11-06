import type { StreamTokenizer } from "./interfaces.js"
import type { EndableStream } from "../StreamClass/interfaces.js"
import { superInit } from "../StreamClass/utils.js"

export function streamTokenizerNext<InType = any, OutType = any>(
	this: StreamTokenizer<InType, OutType>
) {
	return this.handler.call(this, this.value)
}

export function streamTokenizerInitialize<InType = any, OutType = any>(
	this: StreamTokenizer<InType, OutType>,
	input?: EndableStream<InType>
) {
	if (input) superInit(this, input)
	return this
}
