import type { IIndexMap, IPreIndexMap, ITableMap } from "../../../interfaces.js"

export class ModifiableMap<K = any, V = any, Default = any>
	implements IPreIndexMap<V, Default>
{
	private ["constructor"]: new (indexable: IIndexMap<K, V, Default>) => this

	private table?: ITableMap<K, V, Default>

	index(x: any, ...y: any) {
		return this.indexable.index(x, ...y)
	}

	copy() {
		return new this.constructor(this.indexable.copy())
	}

	get modifiable() {
		if (!this.table) this.table = this.indexable.toModifiable()
		return this.table
	}

	constructor(private readonly indexable: IIndexMap<K, V, Default>) {}
}
