import { ProtectedPattern } from "src/Pattern/abstract.js"

import type { Indexed } from "../Stream/interfaces.js"

export abstract class IterableCollection<Type = any>
	extends ProtectedPattern<Indexed<Type>>
	implements Iterable<Type>
{
	*[Symbol.iterator]() {
		let i = 0
		while (this.value.length > i) {
			yield (this.value as Type)[i]
			++i
		}
	}
}

export * as Buffer from "./Buffer/abstract.js"
