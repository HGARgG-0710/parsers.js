import type { BasicStream } from "../../Stream/interfaces.js"

export type ParserFunction<InputType = any, OutType = any> = (
	state?: InputType,
	parser?: Function,
	...x: any[]
) => OutType

export type StreamTransform<UnderType = any, UpperType = any> = (
	input?: BasicStream<UnderType>,
	i?: number,
	...x: any[]
) => UpperType

export type StreamHandler<Type = any[]> = StreamTransform<any, Type>
export type StreamPredicate = StreamHandler<boolean>
