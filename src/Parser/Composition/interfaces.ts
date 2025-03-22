import type { ICopiable } from "../../interfaces.js"

export interface IComposition extends Function, ICopiable {
	layers: Function[]
}

export type * from "./DynamicParser/interfaces.js"
