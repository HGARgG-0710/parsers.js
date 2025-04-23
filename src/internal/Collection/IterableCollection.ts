import { type } from "@hgargg-0710/one"
import type { IIndexed } from "../../interfaces.js"

const { isUndefined } = type

export abstract class IterableCollection<Type = any> implements Iterable<Type> {
	protected collection: IIndexed<Type>;

	*[Symbol.iterator]() {
		yield* this.collection!
	}

	get size() {
		return this.collection!.length
	}

	init(value: IIndexed<Type>) {
		this.collection = value
		return this
	}

	get() {
		return this.collection!
	}

	constructor(value?: IIndexed<Type>) {
		if (!isUndefined(value)) this.collection = value
	}
}
