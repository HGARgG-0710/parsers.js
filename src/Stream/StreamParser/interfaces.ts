import type { Summat } from "@hgargg-0710/summat.ts"
import type { IFreezableBuffer } from "../../interfaces.js"
import type {
	IEndableStream,
	IStream,
	IStreamClassInstance
} from "../interfaces.js"

export type IStreamParserInitSignature<InType = any, OutType = any> = [
	IEndableStream<InType>?,
	IFreezableBuffer<OutType>?,
	Summat?
]

export type IStreamParserConstructor<InType = any, OutType = any> = new (
	value?: IEndableStream<InType>,
	buffer?: IFreezableBuffer<OutType>,
	state?: Summat
) => IConcreteStreamParser<InType, OutType>

export type IStreamParser<InType = any, OutType = any> = IStream<
	OutType,
	IEndableStream<InType>,
	number,
	IStreamParserInitSignature<InType, OutType>
>

export type IConcreteStreamParser<InType = any, OutType = any> = IStreamParser<
	InType,
	OutType
> &
	IStreamClassInstance<
		OutType,
		IEndableStream<InType>,
		number,
		IStreamParserInitSignature<InType, OutType>
	>

export type * from "./interfaces/IndexStream.js"
