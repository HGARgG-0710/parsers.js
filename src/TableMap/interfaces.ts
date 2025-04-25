import type { IPosition, IStream } from "../Stream/interfaces.js"

export type IParserFunction<InputType = any, OutType = any> = (
	state?: InputType,
	parser?: Function,
	...x: any[]
) => OutType

export type IStreamTransform<UnderType = any, UpperType = any> = (
	input?: IStream<UnderType>,
	i?: IPosition<UnderType>,
	...x: any[]
) => UpperType

export type IStreamPredicate<Type = any> = IStreamTransform<Type, boolean>
