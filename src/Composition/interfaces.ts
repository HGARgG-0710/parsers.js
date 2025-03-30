import type { ICopiable, IDynamicBuffer } from "../interfaces.js"

export interface IComposition extends Function, ICopiable {
	readonly layers: IFunctionTuple
}

export type IFunctionTuple = IDynamicBuffer<Function>

export type * from "./DynamicParser/interfaces.js"
