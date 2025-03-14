import type { Indexed } from "src/interfaces.js"
import type { GettablePattern } from "../Pattern/interfaces.js"

export interface Collection<Type = any>
	extends Iterable<Type>,
		GettablePattern<Indexed<Type>> {
	push: (...x: Type[]) => this
}

export type * from "./Buffer/interfaces.js"
