import type { ICopiable, IDynamicBuffer } from "../../interfaces.js"

export interface IComposition extends Function, ICopiable {
	readonly layers: FunctionTuple
}

export type FunctionTuple = IDynamicBuffer<Function>

export type * from "./DynamicParser/interfaces.js"
