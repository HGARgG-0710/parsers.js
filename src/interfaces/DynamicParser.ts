import type { Summat } from "@hgargg-0710/summat.ts"
import type { ICopiable, IInitializable } from "../interfaces.js"
import type { IStreamArray } from "./Stream.js"

export interface IParseState<FinalType = any, InitType = any> extends Summat {
	readonly parse: IParse<FinalType, InitType>
}

export interface IParse<FinalType = any, InitType = any>
	extends ICopiable,
		IInitializable<[InitType?, Summat?]> {
	readonly state: IParseState<FinalType, InitType>
	readonly streams: IStreamArray
	update(): void
}
