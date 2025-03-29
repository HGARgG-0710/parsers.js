import type { IIndexed } from "../interfaces.js"
import { InitializablePattern } from "./Pattern.js"

export abstract class IterableCollection<Type = any>
	extends InitializablePattern<IIndexed<Type>>
	implements Iterable<Type>
{
	get size() {
		return this.value!.length
	}

	*[Symbol.iterator]() {
		yield* this.value as Iterable<Type>
	}
}
