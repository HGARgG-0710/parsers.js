import type { IIndexed } from "../interfaces.js"
import { InitializablePattern } from "./Pattern.js"

export abstract class IterableCollection<Type = any>
	extends InitializablePattern<IIndexed<Type>>
	implements Iterable<Type>
{
	*[Symbol.iterator]() {
		yield* this.value as Iterable<Type>
	}
}
