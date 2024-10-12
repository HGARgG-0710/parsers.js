import type { StreamTokenizer } from "./interfaces.js"
import type { EndableStream } from "../../Stream/StreamClass/interfaces.js"
import { Inputted } from "../../Stream/StreamClass/classes.js"
import { superInit } from "../../Stream/StreamClass/utils.js"

import { typeof as type } from "@hgargg-0710/one"
const { isFunction } = type

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
		superInit(this)
	}
	return this
}
