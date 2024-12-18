import type { StreamParser } from "./interfaces.js"
import type { EndableStream } from "../StreamClass/interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"

import { superInit } from "../StreamClass/utils.js"

import { Stream } from "../../constants.js"
import { isBufferized } from "../../Collection/Buffer/utils.js"
const { SkippedItem } = Stream.StreamParser

export function streamParserNext<InType = any, OutType = any>(
	this: StreamParser<InType, OutType>
) {
	let currRes = SkippedItem
	while (currRes === SkippedItem) currRes = this.handler.call(this, this.value)
	return currRes
}

export function streamParserInitialize<InType = any, OutType = any>(
	this: StreamParser<InType, OutType>,
	input?: EndableStream<InType>,
	state?: Summat
) {
	if (input) {
		if (isBufferized(this)) superInit(this, input, null, state)
		else superInit(this, input, state)
	}
	return this
}
