import { underStreamDefaultIsEnd, underStreamIsEnd } from "../UnderStream/methods.js"

import { StreamClass } from "../StreamClass/classes.js"

import type { StreamTransform } from "src/Parser/ParserMap/interfaces.js"
import type { TransformableStream, TransformedStream } from "./interfaces.js"

import {
	transformedStreamInitCurr,
	transformedStreamNext,
	transformStream
} from "./methods.js"
import type { EndableStream } from "../StreamClass/interfaces.js"
import { Inputted } from "../UnderStream/classes.js"
import { streamIterator } from "../IterableStream/methods.js"

export const TransformedStreamClass = StreamClass({
	isCurrEnd: underStreamIsEnd,
	initGetter: transformedStreamInitCurr,
	baseNextIter: transformedStreamNext,
	defaultIsEnd: underStreamDefaultIsEnd
})

export function TransformedStream<UnderType = any, UpperType = any>(
	input: TransformableStream<UnderType, UpperType>,
	transform: StreamTransform<UnderType, UpperType>
): TransformedStream<UnderType, UpperType> {
	const result = Inputted(TransformedStreamClass(), input)
	result.pos = 0
	result.transform = transform
	result[Symbol.iterator] = streamIterator<UpperType>
	return result as TransformedStream<UnderType, UpperType>
}

export function TransformableStream<UnderType = any, UpperType = any>() {
	return function (
		stream: EndableStream<UnderType>
	): TransformableStream<UnderType, UpperType> {
		stream.transform = transformStream<UnderType, UpperType>
		return stream as TransformableStream<UnderType, UpperType>
	}
}
