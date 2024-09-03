import {
	ForwardStreamIterationHandler,
	PositionalStream,
	StreamCurrGetter,
	streamTokenizerCurrentCondition,
	streamTokenizerCurrGetter,
	underStreamIsEnd,
	type BaseStream,
	type BasicStream,
	type EssentialStream
} from "main.js"
import type { Inputted, Started } from "src/interfaces.js"
import type { Transformable } from "src/interfaces/Transformable.js"
import type { StreamTransform } from "src/parsers/ParserMap.js"
import { transformedStreamNext } from "./BasicStream.js"

export interface TransformableStream<UnderType = any, UpperType = any>
	extends BaseStream<UnderType>,
		Transformable<UnderType, BasicStream<UpperType>> {}

export interface TransformedStream<UnderType = any, UpperType = any>
	extends PositionalStream<UpperType, number>,
		EssentialStream<UpperType>,
		Inputted<BaseStream<UnderType>>,
		Started {
	transform: StreamTransform<UnderType, UpperType>
}

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

export function transformStream<UnderType = any, UpperType = any>(
	this: TransformableStream<UnderType, UpperType>,
	transform: StreamTransform<UnderType, UpperType>
) {
	return TransformedStream<UnderType, UpperType>(this, transform)
}

export function TransformableStream<UnderType = any, UpperType = any>() {
	return function (
		stream: BaseStream<UnderType>
	): TransformableStream<UnderType, UpperType> {
		stream.transform = transformStream<UnderType, UpperType>
		return stream as TransformableStream<UnderType, UpperType>
	}
}
