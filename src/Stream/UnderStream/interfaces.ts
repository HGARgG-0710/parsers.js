import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { EndableStream, IsStartCurrable } from "../StreamClass/interfaces.js"

export interface Inputted<Type = any> extends Summat {
	input: Type
}

export interface UnderStream<StreamType extends BasicStream = BasicStream, Type = any>
	extends Inputted<StreamType>,
		BasicStream<Type> {}

export interface BaseUnderStream<
	StreamType extends EndableStream = EndableStream,
	Type = any
> extends UnderStream<StreamType, Type>,
		EndableStream<Type> {}

export interface IsCurrableUnderStream<
	StreamType extends BasicStream = BasicStream,
	Type = any
> extends UnderStream<StreamType & IsStartCurrable, Type> {}
