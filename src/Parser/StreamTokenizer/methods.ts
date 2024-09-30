import { typeof as type } from "@hgargg-0710/one"
const { isFunction } = type

import type { StreamTokenizer } from "./interfaces.js"
import { Inputted } from "src/Stream/UnderStream/classes.js"
import type { EndableStream } from "src/Stream/StreamClass/interfaces.js"

export function streamTokenizerNext<Type = any>(this: StreamTokenizer<Type>) {
	const mapped = this.tokenMap(this.input)
	return isFunction(mapped) ? mapped.call(this, this.input) : mapped
}

export function streamTokenizerInitialize<InType = any, OutType = any>(
	this: StreamTokenizer<InType, OutType>,
	input?: EndableStream<InType>
) {
	if (input) {
		Inputted(this, input)
		this.super.init.call(this)
	}
	return this
}
