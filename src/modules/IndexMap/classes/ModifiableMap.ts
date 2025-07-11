import type { IIndexMap, ISettable, ITableMap } from "../../../interfaces.js"
import type { ITableCarrier } from "../interfaces/LiquidMap.js"

/**
 * This is a class for enabling modifiability of a given
 * `IIndexMap<K, V, Default>`. It does so by pairing it
 * with an `ITableMap`, utilizing the `ITableCarrier`
 * and `ILiquidMap` interfaces. The underyling immutable
 * representation, which is `.index()`able, can be
 * replaced with a new one created from the modified
 * version via the ``
 */
export class ModifiableMap<K = any, V = any, Default = any>
	implements IIndexMap<K, V, Default>, ISettable<K, V>
{
	private ["constructor"]: new (indexable: IIndexMap<K, V, Default>) => this

	private readonly modifiable: ITableMap<K, V, Default>

	index(x: any, ...y: any) {
		return this.indexable.index(x, ...y)
	}

	set(key: K, value: V, index?: number) {
		this.modifiable.set(key, value, index)
		this.update()
	}

	copy() {
		return new this.constructor(this.indexable.copy())
	}

	update() {
		this.indexable.fromCarrier(this.modifiable.toCarrier())
	}

	toModifiable(): ITableMap<K, V, Default> {
		return this.modifiable.copy()
	}

	fromCarrier(carrier: ITableCarrier<K, V, Default>): void {
		this.modifiable.fromCarrier(carrier)
		this.update()
	}

	constructor(private readonly indexable: IIndexMap<K, V, Default>) {
		this.modifiable = this.indexable.toModifiable()
	}
}
