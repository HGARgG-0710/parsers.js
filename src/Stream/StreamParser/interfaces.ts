import type { IStreamClassInstance } from "../../Stream/StreamClass/interfaces.js"
import type { IEndableStream } from "../interfaces.js"
import type { IStreamTransform } from "../../TableMap/interfaces.js"
import type { IFreezableBuffer, IPointer, ISupered } from "../../interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"

export type IStreamParserInitSignature<InType = any, OutType = any> = [
	IEndableStream<InType>?,
	IFreezableBuffer<OutType>?,
	Summat?
]

export type IStreamParserConstructor<InType = any, OutType = any> = new (
	value?: IEndableStream<InType>,
	buffer?: IFreezableBuffer<OutType>,
	state?: Summat
) => IStreamParser<InType, OutType>

export type IStreamParser<InType = any, OutType = any> = IStreamClassInstance<
	OutType,
	IEndableStream<InType>,
	number,
	IStreamParserInitSignature<InType, OutType>
> &
	IPointer<IEndableStream<InType>> &
	ISupered & {
		["constructor"]: IStreamParserConstructor<InType, OutType>
		handler: IStreamTransform<InType, OutType>
	}
