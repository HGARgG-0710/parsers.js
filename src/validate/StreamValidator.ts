import type { ParserMap, StreamHandler } from "../parsers/ParserMap.js"
import type { BasicStream } from "../types.js"
import {
	DefineFinished,
	GeneralParser,
	type ParsingState
} from "../parsers/GeneralParser.js"

// ? Take out this type used for determining the '.next' call? [could be a simple 'StreamHandler...'];
export type StreamValidatorState<KeyType = any> = ParsingState<
	BasicStream<KeyType>,
	boolean,
	StreamHandler<boolean>,
	KeyType
>

export function streamValidatorFinished<KeyType = any>(
	this: StreamValidatorState<KeyType>
) {
	return this.streams[0].isEnd || !this.result
}

export function streamValidatorChange<KeyType = any>(
	this: StreamValidatorState<KeyType>,
	next: StreamHandler<boolean>
) {
	this.result = next && next(this.streams[0])
	if (this.result) this.streams[0].next()
}

export function StreamValidator<KeyType = any>(
	validator: ParserMap<KeyType, StreamHandler<boolean>, StreamValidatorState<KeyType>>
) {
	return GeneralParser<StreamValidatorState<KeyType>>(
		DefineFinished(
			{
				change: streamValidatorChange<KeyType>,
				parser: validator,
				result: true
			},
			streamValidatorFinished<KeyType>
		)
	)
}
