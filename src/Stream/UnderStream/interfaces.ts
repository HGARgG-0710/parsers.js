import type { BaseStream, BasicStream, ReverseBaseStream } from "_src/types.js"
import type { Inputted } from "../interfaces.js"

export interface UnderStream<StreamType extends BasicStream = BasicStream, Type = any>
	extends Inputted<StreamType>,
		BasicStream<Type> {}

export interface BaseUnderStream<StreamType extends BaseStream = BaseStream, Type = any>
	extends UnderStream<StreamType, Type>,
		BaseStream<Type> {}

export interface ReverseBaseUnderStream<
	StreamType extends ReverseBaseStream = ReverseBaseStream,
	Type = any
> extends UnderStream<StreamType, Type>,
		ReverseBaseStream<Type> {}
