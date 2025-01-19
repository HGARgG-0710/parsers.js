import type { StreamParser } from "./interfaces.js"
import type { EndableStream } from "../StreamClass/interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"

import { superInit } from "../StreamClass/refactor.js"
import { isBufferized } from "../../Collection/Buffer/utils.js"

import { Stream } from "../../constants.js"
const { SkippedItem } = Stream.StreamParser

export function streamParserNext<InType = any, OutType = any>(
	this: StreamParser<InType, OutType>
) {
	let currRes: OutType
	do currRes = this.handler.call(this, this.value)
	while (currRes === SkippedItem)
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
