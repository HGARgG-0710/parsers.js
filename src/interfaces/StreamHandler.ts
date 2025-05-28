import type { IPosition, IStream } from "./Stream.js"

export type IParserFunction<In = any, Out = any> = (
	state?: In,
	parser?: Function,
	...x: any[]
) => Out

export type IStreamTransform<UnderType = any, UpperType = any> = (
	input?: IStream<UnderType>,
	i?: IPosition<UnderType>,
	...x: any[]
) => UpperType

export type IStreamPredicate<Type = any> = IStreamTransform<Type, boolean>
