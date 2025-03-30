import type { IBasicStream } from "../Stream/interfaces.js"

export type IParserFunction<InputType = any, OutType = any> = (
	state?: InputType,
	parser?: Function,
	...x: any[]
) => OutType

export type IStreamTransform<UnderType = any, UpperType = any> = (
	input?: IBasicStream<UnderType>,
	i?: number,
	...x: any[]
) => UpperType

export type IStreamHandler<Type = any> = IStreamTransform<any, Type>
export type IStreamPredicate = IStreamHandler<boolean>
