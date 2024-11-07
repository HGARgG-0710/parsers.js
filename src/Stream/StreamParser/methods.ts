import type { StreamParser } from "./interfaces.js"
import type { EndableStream } from "../StreamClass/interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"

import { superInit } from "../StreamClass/utils.js"

export function streamParserNext<InType = any, OutType = any>(
	this: StreamParser<InType, OutType>
) {
	return this.handler.call(this, this.value)
}

export function streamParserInitialize<InType = any, OutType = any>(
	this: StreamParser<InType, OutType>,
	input?: EndableStream<InType>,
	state?: Summat
) {
	if (input) {
		if (this.buffer) superInit(this, input, null, state)
		else superInit(this, input, state)
	}
	return this
}
