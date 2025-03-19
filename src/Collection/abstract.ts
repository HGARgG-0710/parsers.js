import type { IIndexed } from "src/interfaces.js"
import { InitializablePattern } from "src/Pattern/abstract.js"

export abstract class IterableCollection<Type = any>
	extends InitializablePattern<IIndexed<Type>>
	implements Iterable<Type>
{
	*[Symbol.iterator]() {
		yield* this.value as Iterable<Type>
	}
}
