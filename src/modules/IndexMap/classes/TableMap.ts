import { array, inplace, type } from "@hgargg-0710/one"
import assert from "assert"
import type {
	ICopiable,
	IDefaulting,
	ITableCarrier
} from "../../../interfaces.js"
import { Pairs } from "../../../samples.js"
import { isGoodIndex } from "../../../utils.js"
import type { ITableMap } from "../interfaces/TableMap.js"
import { TableCarrier } from "./LiquidMap.js"

const { isArray } = type
const { insert, out, swap } = inplace

/**
 * This is a class for representing a column-like array
 * of items, composing a larger table-like data-structure.
 * Useful for implementing some form of multivariate indexing.
 */
export class TableColumn<T = any> implements ICopiable {
	private ["constructor"]: new (items?: T[]) => this

	get size() {
		return this.items.length
	}

	set(i: number, value: T) {
		this.items[i] = value
	}

	insert(i: number, ...values: T[]) {
		insert(this.items, i, ...values)
	}

	delete(i: number, count: number = 1) {
		out(this.items, i, count)
	}

	reverse() {
		this.items.reverse()
	}

	swap(i: number, j: number) {
		swap(this.items, i, j)
	}

	read(i: number) {
		return this.items[i]
	}

	map(indexes: readonly number[]) {
		this.items = indexes.map((x) => this.items[x])
	}

	push(...newItems: T[]) {
		this.items.push(...newItems)
	}

	indexOf(someItem: T) {
		return this.items.indexOf(someItem)
	}

	reset(items: T[]) {
		this.items = items
	}

	get(): readonly T[] {
		return this.items
	}

	copy() {
		return new this.constructor(array.copy(this.items))
	}

	constructor(private items: T[] = []) {}
}

/**
 * Represents a pair of `TableColumn`s
 * used to represent a key-value map.
 */
class ColumnPair<K = any, V = any> {
	readonly keys: TableColumn<K>
	readonly values: TableColumn<V>

	reset(keys: K[], values: V[]) {
		this.keys.reset(keys)
		this.values.reset(values)
	}

	constructor(keys: K[], values: V[]) {
		this.keys = new TableColumn(keys)
		this.values = new TableColumn(values)
	}
}

/**
 * Represents the key-value map
 * as an immutable read-only
 * pair of arrays with equal
 * sizes.
 */
class ImmutableMap<K = any, V = any> {
	private get keyColumn() {
		return this.columns.keys
	}

	private get valueColumn() {
		return this.columns.values
	}

	get size() {
		return this.keyColumn.size
	}

	get keys() {
		return this.keyColumn.get()
	}

	get values() {
		return this.valueColumn.get()
	}

	find(key: K) {
		return this.keyColumn.indexOf(key)
	}

	readKey(i: number) {
		return this.keyColumn.read(i)
	}

	readValue(i: number) {
		return this.valueColumn.read(i)
	}

	constructor(private readonly columns: ColumnPair<K, V>) {}
}

/**
 * This is a class for counting an occurence of a
 * given item inside a predetermined array of items
 * of type `T`.
 */
class ItemCounter<T = any> {
	count(item: T) {
		let met = 0
		for (let i = 0; i < this.items.length; ++i)
			if (this.items[i] === item) ++met
		return met
	}

	constructor(private readonly items: T[]) {}
}

/**
 * This class encompasses the capability of
 * viewing a key-value map as an iterable/indexable
 * list of pairs instead of a read-write structure.
 */
class PairIterator<K = any, V = any> {
	at(i: number): [K, V] {
		return [this.immutable.readKey(i), this.immutable.readValue(i)]
	}

	*[Symbol.iterator]() {
		for (let i = 0; i < this.immutable.size; ++i) yield this.at(i)
	}

	constructor(private readonly immutable: ImmutableMap<K, V>) {}
}

/**
 * A class for providing a way of verifying
 * validity of a given read/write index in
 * a key-value map.
 */
class IndexVerifier<K = any, V = any> {
	isKnown(index: number) {
		return isGoodIndex(index) && this.immutable.size > index
	}

	constructor(readonly immutable: ImmutableMap<K, V>) {}
}

/**
 * A class for providing a way of verifying
 * validity of a given read/write key in
 * a key-value map.
 */
class KeyVerifier<K = any, V = any> {
	private get immutable() {
		return this.verifier.immutable
	}

	isKnown(key: K) {
		return this.verifier.isKnown(this.immutable.find(key))
	}

	constructor(private readonly verifier: IndexVerifier<K, V>) {}
}

/**
 * A class for contianing an algorithm
 * for ensuring the uniqueness of keys
 * inside a key-value map.
 */
class UniquenessEnsurer<K = any, V = any> {
	uniqueIndexes() {
		const uniqueKeys = new Set()
		const indexes: number[] = []

		for (let i = 0; i < this.immutable.size; ++i) {
			const curr = this.immutable.readKey(i)
			if (!uniqueKeys.has(curr)) {
				uniqueKeys.add(curr)
				indexes.push(i)
			}
		}

		return indexes
	}

	constructor(private readonly immutable: ImmutableMap<K, V>) {}
}

/**
 * A class for representation of a
 * key-value map as a pair of mutable
 * arrays.
 */
class MutableMap<K = any, V = any> {
	private get keys() {
		return this.columns.keys
	}

	private get values() {
		return this.columns.values
	}

	setKey(index: number, key: K) {
		this.keys.set(index, key)
	}

	setValue(index: number, value: V) {
		this.values.set(index, value)
	}

	setPair(index: number, [key, value]: [K, V]) {
		this.setKey(index, key)
		this.setValue(index, value)
	}

	reverse() {
		this.keys.reverse()
		this.values.reverse()
	}

	map(indexes: readonly number[]) {
		this.keys.map(indexes)
		this.values.map(indexes)
	}

	swap(i: number, j: number) {
		this.keys.swap(i, j)
		this.values.swap(i, j)
	}

	push([newKeys, newValues]: [K[], V[]]) {
		this.keys.push(...newKeys)
		this.values.push(...newValues)
	}

	insert(index: number, [keys, values]: [K[], V[]]) {
		this.keys.insert(index, ...keys)
		this.values.insert(index, ...values)
	}

	delete(index: number, count: number = 1) {
		this.keys.delete(index, count)
		this.values.delete(index, count)
	}

	constructor(private readonly columns: ColumnPair<K, V>) {}
}

/**
 * This is a class for representing a
 * given key-value map as (primarily)
 * a mutable indexed collection with
 * non-trivial mutation methods,
 * capable of being grown and mutated,
 * but not shrunk.
 */
class IndexedRecord<K = any, V = any> {
	add(index: number, kv: [K[], V[]]) {
		if (this.verifier.isKnown(index)) this.mutable.insert(index, kv)
		else this.mutable.push(kv)
		return kv
	}

	replace(index: number, pair: [K, V]) {
		if (this.verifier.isKnown(index)) this.mutable.setPair(index, pair)
	}

	push(key: K, value: V) {
		this.mutable.push([[key], [value]])
	}

	constructor(
		private readonly mutable: MutableMap<K, V>,
		readonly verifier: IndexVerifier<K, V>
	) {}
}

/**
 * This is a representation of a key-value
 * map with index-safe (i.e. verified)
 * non-trivial mutating operations,
 * and index-unsafe (i.e. expecting
 * to be given an index verified
 * elsewhere) operations.
 */
class SafeWriteTable<K = any, V = any> {
	private get verifier() {
		return this.record.verifier
	}

	set(keyIndex: number, key: K, value: V) {
		if (this.verifier.isKnown(keyIndex))
			this.mutable.setValue(keyIndex, value)
		else this.record.push(key, value)
	}

	rekey(fromIndex: number, to: K) {
		if (this.verifier.isKnown(fromIndex)) this.mutable.setKey(fromIndex, to)
	}

	constructor(
		private readonly mutable: MutableMap<K, V>,
		private readonly record: IndexedRecord<K, V>
	) {}
}

/**
 * This is a representation of a
 * key-value map with mutating
 * methods employing key-based
 * indexation.
 */
class DualTable<K = any, V = any> {
	private readonly safe: SafeWriteTable<K, V>

	private find(key: K) {
		return this.immutable.find(key)
	}

	by(key: K) {
		return this.immutable.readValue(this.find(key))
	}

	set(key: K, value: V) {
		const keyIndex = this.find(key)
		this.safe.set(keyIndex, key, value)
		return keyIndex
	}

	rekey(from: K, to: K) {
		this.safe.rekey(this.find(from), to)
	}

	constructor(
		private readonly immutable: ImmutableMap<K, V>,
		mutable: MutableMap<K, V>,
		record: IndexedRecord<K, V>
	) {
		this.safe = new SafeWriteTable(mutable, record)
	}
}

/**
 * This is a representation of a key-value map
 * with a default value and read-only operations,
 * permitting one to extract a given index.
 */
class DefaultingTable<K = any, V = any, Default = any>
	implements IDefaulting<Default>
{
	private readonly keyVerifier: KeyVerifier<K, V>
	private _default: Default

	private set default(newDefault: Default) {
		this._default = newDefault
	}

	get default() {
		return this._default
	}

	setDefault(newDefault: Default) {
		this.default = newDefault
	}

	by(key: K) {
		return this.keyVerifier.isKnown(key) ? this.dual.by(key) : this.default
	}

	read(index: number) {
		return this.indexVerifier.isKnown(index)
			? this.pairs.at(index)
			: this.default
	}

	constructor(
		private readonly indexVerifier: IndexVerifier<K, V>,
		private readonly dual: DualTable<K, V>,
		private readonly pairs: PairIterator<K, V>,
		_default: Default
	) {
		this.keyVerifier = new KeyVerifier(this.indexVerifier)
		this.default = _default
	}
}

/**
 * This is a class implementing the `ITableMap<K, V, Default>`.
 * It permits the user to make necessary changes to a key-value
 * table, as well as introspect its contents via `.read`,
 * or directly via the `readonly .keys/.values` properies.
 *
 * It is the one used by the `MapClass` classes' instances.
 */
export class TableMap<K = any, V = any, Default = any>
	implements ITableMap<K, V, Default>
{
	private ["constructor"]: new (
		keys: K[],
		values: V[],
		_default?: Default
	) => this

	private readonly asColumns: ColumnPair<K, V>
	private readonly asImmutable: ImmutableMap<K, V>
	private readonly asMutable: MutableMap<K, V>
	private readonly asPairs: PairIterator<K, V>
	private readonly asRecord: IndexedRecord<K, V>
	private readonly asDual: DualTable<K, V>
	private readonly asDefaulting: DefaultingTable<K, V, Default>
	private readonly keyCounter: ItemCounter<K>
	private readonly ensurer: UniquenessEnsurer<K, V>

	get default() {
		return this.asDefaulting.default
	}

	get size() {
		return this.asImmutable.size
	}

	set(key: K, value: V) {
		return this.asDual.set(key, value)
	}

	reverse() {
		this.asMutable.reverse()
		return this
	}

	unique() {
		const indexes = this.ensurer.uniqueIndexes()
		this.asMutable.map(indexes)
		return indexes
	}

	read(index: number) {
		return this.asDefaulting.read(index)
	}

	by(key: K) {
		return this.asDefaulting.by(key)
	}

	swap(i: number, j: number) {
		this.asMutable.swap(i, j)
		return this
	}

	concat(x: Iterable<[K, V]>) {
		const kv = Pairs.from(x)
		this.asMutable.push(kv)
		return kv
	}

	add(index: number, ...pairs: array.Pairs<K, V>) {
		const kv = Pairs.from(pairs)
		this.asRecord.add(index, kv)
		return kv
	}

	delete(index: number, count?: number) {
		this.asMutable.delete(index, count)
		return this
	}

	replace(index: number, pair: [K, V]) {
		this.asRecord.replace(index, pair)
		return this
	}

	rekey(from: K, to: K) {
		this.asDual.rekey(from, to)
		return this
	}

	copy() {
		return new this.constructor(
			array.copy(this.asImmutable.keys as K[]),
			array.copy(this.asImmutable.values as V[]),
			this.default
		)
	}

	*[Symbol.iterator]() {
		yield* this.asPairs
	}

	fromCarrier(carrier: ITableCarrier<K, V, Default>): this {
		this.asDefaulting.setDefault(carrier.default)
		this.asColumns.reset(
			array.copy(carrier.keys as K[]),
			array.copy(carrier.values as V[])
		)
		return this
	}

	toCarrier() {
		return new TableCarrier(
			array.copy(this.asImmutable.keys as K[]),
			array.copy(this.asImmutable.values as V[]),
			this.default
		)
	}

	keyIndex(key: K) {
		return this.asImmutable.find(key)
	}

	count(key: K) {
		return this.keyCounter.count(key)
	}

	constructor(keys: K[], values: V[], _default?: Default) {
		assert(isArray(keys))
		assert(isArray(values))
		assert.strictEqual(keys.length, values.length)

		this.asColumns = new ColumnPair(keys, values)
		this.keyCounter = new ItemCounter(keys)
		this.asImmutable = new ImmutableMap(this.asColumns)
		this.asPairs = new PairIterator(this.asImmutable)
		this.ensurer = new UniquenessEnsurer(this.asImmutable)

		const verifier = new IndexVerifier(this.asImmutable)
		this.asMutable = new MutableMap(this.asColumns)
		this.asRecord = new IndexedRecord(this.asMutable, verifier)

		this.asDual = new DualTable(
			this.asImmutable,
			this.asMutable,
			this.asRecord
		)

		this.asDefaulting = new DefaultingTable(
			verifier,
			this.asDual,
			this.asPairs,
			_default as Default
		)
	}
}
