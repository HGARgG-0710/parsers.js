import { underStreamIsEnd } from "../UnderStream/methods.js"
import {
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "../IterationHandler/classes.js"

import { streamTokenizerCurrGetter } from "../PreBasicStream/methods.js"
import { streamTokenizerCurrentCondition } from "src/Parser/StreamTokenizer/methods.js"
import type { StreamTransform } from "src/Parser/ParserMap/interfaces.js"
import { transformedStreamNext } from "../BasicStream/methods.js"
import type { TransformableStream, TransformedStream } from "./interfaces.js"
import { transformStream } from "./methods.js"

import type { BaseStream } from "../BasicStream/interfaces.js"

export function TransformedStream<UnderType = any, UpperType = any>(
	input: TransformableStream<UnderType, UpperType>,
	transform: StreamTransform<UnderType, UpperType>
): TransformedStream<UnderType, UpperType> {
	return ForwardStreamIterationHandler(
		StreamCurrGetter(
			{
				pos: 0,
				transform,
				input,
				isStart: true
			},
			streamTokenizerCurrGetter<UpperType>,
			streamTokenizerCurrentCondition
		),
		transformedStreamNext<UnderType, UpperType>,
		underStreamIsEnd<UpperType>
	) as TransformedStream<UnderType, UpperType>
}

export function TransformableStream<UnderType = any, UpperType = any>() {
	return function (
		stream: BaseStream<UnderType>
	): TransformableStream<UnderType, UpperType> {
		stream.transform = transformStream<UnderType, UpperType>
		return stream as TransformableStream<UnderType, UpperType>
	}
}
