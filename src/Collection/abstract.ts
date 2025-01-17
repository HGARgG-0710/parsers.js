import { InitializablePattern } from "src/Pattern/abstract.js"

import type { Indexed } from "../Stream/interfaces.js"

export abstract class IterableCollection<Type = any>
	extends InitializablePattern<Indexed<Type>>
	implements Iterable<Type>
{
	*[Symbol.iterator]() {
		let i = 0
		while (this.value!.length > i) {
			yield this.value![i] as Type
			++i
		}
	}
}

export * as Buffer from "./Buffer/abstract.js"
