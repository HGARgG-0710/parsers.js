import type { IIndexMap, IPreIndexMap, ITableMap } from "../../../interfaces.js"

/**
 * This is a class for enabling modifiability of a given
 * `IIndexMap<K, V, Default>`. It does so via providing
 * the user with the `.modifiable: ITableMap<K, V, Default>` property, 
 * which contains the needed methods of `ITableMap`, and the `.update`
 * method, which registers the change (allowing the user far greater 
 * freedom of control over how and when the underlying table is changed). 
 */
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

	update() {
		this.indexable = this.indexable.fromModifiable(this.table!)
	}

	get modifiable() {
		if (!this.table) this.table = this.indexable.toModifiable()
		return this.table
	}

	constructor(private indexable: IIndexMap<K, V, Default>) {}
}
