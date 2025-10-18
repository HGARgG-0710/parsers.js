import { array } from "@hgargg-0710/one"
import { ArrayCollection } from "./ArrayCollection.js"

/**
 * This is a class for the building of arrays.
 * It is identical to `ArrayCollection<T>`, save only
 * for the fact that `.get()` createsd a copy of `this.items`.
 * This is useful for situations when many distinct arrays
 * have to be initialized via a single instance of `ArrayBuilder`.
 */
export class ArrayBuilder<T = any> extends ArrayCollection<T> {
	get() {
		return array.copy(super.get() as T[])
	}
}
