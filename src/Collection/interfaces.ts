import type { Indexed } from "../Stream/interfaces.js"
import type { Pointer } from "../Pattern/interfaces.js"

export interface Collection<Type = any> extends Pointer<Indexed<Type>>, Iterable<Type> {
	push: (...x: Type[]) => Collection<Type>
}

export * as Buffer from "./Buffer/interfaces.js"
