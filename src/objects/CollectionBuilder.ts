import type {
	IExtendableCollection,
	IIndexed,
	IPrototypeCollection
} from "../interfaces.js"

export class CollectionBuilder<T = any, C extends IIndexed<T> = IIndexed<T>>
	implements IExtendableCollection<T, C>
{
	push(...items: T[]): this {
		this.protoCollection.push(...items)
		return this
	}

	get() {
		return this.protoCollection.copy().get()
	}

	clear() {
		this.protoCollection.clear()
	}

	constructor(private readonly protoCollection: IPrototypeCollection<T, C>) {}
}
