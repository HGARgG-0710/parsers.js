import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	BaseStream,
	BasicStream,
	ReverseBaseStream
} from "../BasicStream/interfaces.js"


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
export interface Inputted<Type = any> extends Summat {
	input: Type
}
