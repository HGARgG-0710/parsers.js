import type { IIndexed } from "../../interfaces.js"
import { DelegateIterable } from "../delegates/Iterable.js"

export abstract class IterableCollection<Type = any>
	extends DelegateIterable<Type>
	implements Iterable<Type>
{
	protected value: IIndexed<Type>

	get size() {
		return this.value!.length
	}
}
