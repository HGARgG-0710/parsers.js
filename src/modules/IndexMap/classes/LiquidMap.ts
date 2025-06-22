import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import { isGoodIndex } from "../../../utils.js"
import type { ILiquidMap, ITableCarrier } from "../interfaces/LiquidMap.js"
import type { ITableMap } from "../interfaces/TableMap.js"
import { TableMap } from "./TableMap.js"

const { isArray } = type
const { copy } = array

/**
 * This is a class that implements the `ILiquidMap` interface,
 * utilizing (as its implementations) `TableMap` and `TableCarrier`
 * default implementations. This is considered to be a default
 * implementation of the `ILiquidMap`.
 */
export class LiquidMap<K = any, V = any, Default = any>
	implements ILiquidMap<K, V, Default>
{
	private ["constructor"]: new (
		keys: K[],
		values: V[],
		_default?: Default
	) => this

	private default: Default

	toCarrier(): ITableCarrier<K, V, Default> {
		return new TableCarrier(
			copy(this.keys),
			copy(this.values),
			this.default
		)
	}

	toModifiable(): ITableMap<K, V, Default> {
		return new TableMap(copy(this.keys), copy(this.values), this.default)
	}

	fromCarrier(carrier: ITableCarrier<K, V, Default>): this {
		this.keys = copy(carrier.keys as K[])
		this.values = copy(carrier.values as V[])
		this.default = carrier.default
		return this
	}

	copy() {
		return new this.constructor(
			copy(this.keys),
			copy(this.values),
			this.default
		)
	}

	constructor(
		private keys: K[] = [],
		private values: V[] = [],
		_default?: Default
	) {
		this.default = _default as Default
	}
}

/**
 * This is a basic `ITableCarrier<K, V, Default>`
 * implementation that simply contains the immutable
 * `.keys: K[]`, `.values: V[]` and `.default: Default`,
 * as well as `.read(i: number): V | Default`,
 * permitting one to get the values of the table
 * carried-over in a way that respects the `.default`
 * value.
 */
export class TableCarrier<K = any, V = any, Default = undefined>
	implements ITableCarrier<K, V, Default>
{
	readonly default: Default

	get size() {
		return this.keys.length
	}

	read(i: number) {
		return isGoodIndex(i) && i < this.size ? this.values[i] : this.default
	}

	constructor(readonly keys: K[], readonly values: V[], _default?: Default) {
		assert(isArray(keys))
		assert(isArray(values))
		assert.strictEqual(keys.length, values.length)
		this.default = _default as Default
	}
}
