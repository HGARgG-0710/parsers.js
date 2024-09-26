import { underStreamDefaultIsEnd, underStreamIsEnd } from "../UnderStream/methods.js"

import type { EndableStream } from "../StreamClass/interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"

import type { StreamTransform } from "src/Parser/ParserMap/interfaces.js"
import type {
	EndableTransformableStream,
	EffectiveTransformedStream
} from "./interfaces.js"

import {
	transformedStreamInitCurr,
	transformedStreamInitialize,
	transformedStreamNext,
	transformStream
} from "./methods.js"

export const TransformedStreamBase = StreamClass({
	isCurrEnd: underStreamIsEnd,
	initGetter: transformedStreamInitCurr,
	baseNextIter: transformedStreamNext,
	defaultIsEnd: underStreamDefaultIsEnd
})

export class TransformedStream<UnderType = any, UpperType = any>
	extends TransformedStreamBase
	implements EffectiveTransformedStream<UnderType, UpperType>
{
	pos: number
	input: EndableTransformableStream<UnderType, UpperType>
	transform: () => UpperType
	constructor(
		input?: EndableTransformableStream<UnderType, UpperType>,
		transform?: StreamTransform<UnderType, UpperType>
	) {
		super()
		this.init(input, transform)
		super.init()
	}
}

Object.defineProperties(TransformedStream.prototype, {
	init: { value: transformedStreamInitialize }
})

export function TransformableStream<UnderType = any, UpperType = any>() {
	return function (
		stream: EndableStream<UnderType>
	): EndableTransformableStream<UnderType, UpperType> {
		stream.transform = transformStream<UnderType, UpperType>
		return stream as EndableTransformableStream<UnderType, UpperType>
	}
}
