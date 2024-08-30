import type { BasicStream, Inputted } from "src/types/Stream/BasicStream.js"
import type { StreamMap } from "./ParserMap.js"
import {
	StreamCurrGetter,
	StreamEndingHandler
} from "../types/Stream/StreamEndingHandler.js"
import type { StartedStream } from "main.js"

import { typeof as type } from "@hgargg-0710/one"
const { isFunction } = type

export interface StreamTokenizer<OutType = any>
	extends Inputted<BasicStream>,
		StartedStream<OutType> {
	tokenMap: StreamMap<OutType>
}

export function streamTokenizerIsEnd<Type = any>(this: StreamTokenizer<Type>) {
	return !this.curr
}

export function streamTokenizerNext<Type = any>(this: StreamTokenizer<Type>) {
	const prev = this.curr
	const mapped = this.tokenMap(this.input)
	this.curr = isFunction(mapped) ? mapped.call(this, this.input) : mapped
	this.input.next()
	return prev as Type
}

export function streamTokenizerCurrGetter<Type = any>(this: StreamTokenizer<Type>) {
	this.isStart = false
	return this.next()
}

export function streamTokenizerCurrentCondition<Type = any>(this: StreamTokenizer<Type>) {
	return !this.isStart
}

export function StreamTokenizer<OutType = any>(tokenMap: StreamMap<OutType>) {
	return function (input: BasicStream): StreamTokenizer<OutType> {
		return StreamEndingHandler(
			StreamCurrGetter(
				{
					tokenMap,
					input,
					next: streamTokenizerNext<OutType>,
					isStart: true
				},
				streamTokenizerCurrGetter<OutType>
			),
			streamTokenizerIsEnd<OutType>
		) as StreamTokenizer<OutType>
	}
}
