import type { IStreamPosition } from "../modules/Stream/interfaces/StreamPosition.js"
import type { IStream } from "./Stream.js"

export type IParserFunction<In = any, Out = any> = (
	state?: In,
	parser?: Function,
	...x: any[]
) => Out

export type IStreamTransform<UnderType = any, UpperType = any> = (
	input?: IStream<UnderType>,
	i?: IStreamPosition<UnderType>,
	...x: any[]
) => UpperType

export type IStreamPredicate<T = any> = IStreamTransform<T, boolean>
