import type { Indexed } from "src/interfaces.js"
import { InitializablePattern } from "src/Pattern/abstract.js"

export abstract class IterableCollection<Type = any>
	extends InitializablePattern<Indexed<Type>>
	implements Iterable<Type>
{
	*[Symbol.iterator]() {
		yield* this.value as Iterable<Type>
	}
}
