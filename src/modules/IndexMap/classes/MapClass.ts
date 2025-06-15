import {
	array,
	boolean,
	functional,
	object,
	string,
	type
} from "@hgargg-0710/one"
import assert from "assert"
import { BadIndex } from "../../../constants.js"
import type {
	IHaving,
	IIndexingFunction,
	ITableMap,
	ITestable
} from "../../../interfaces.js"
import type { IIndexMap, IMapClass } from "../../../interfaces/MapClass.js"
import { isGoodIndex } from "../../../utils.js"
import { TableMap } from "./TableMap.js"

const { isArray } = type
const { trivialCompose } = functional
const { equals } = boolean
const { copy } = array

function extend<K = any, V = any>(
	this: IMapClass<K, V>,
	...f: ((x: V) => any)[]
) {
	return MapClass<K>(
		this.change,
		this.extensions.concat(f),
		this.keyExtensions
	)
}

function extendKey<K = any, V = any>(
	this: IMapClass<K, V>,
	...f: ((x: any) => K)[]
) {
	return MapClass<any, V>(
		this.change,
		this.extensions,
		this.keyExtensions.concat(f)
	)
}

abstract class PreMapClass<K = any, V = any, Default = any>
	implements IIndexMap<K, V, Default>
{
	protected ["constructor"]: new (
		keys: K[],
		values: V[],
		_default?: Default
	) => this

	readonly default: Default
	private readonly keys: K[]
	private readonly values: V[]
	private readonly alteredKeys: any[]

	private change?: IIndexingFunction<K>
	private extension: (x: any, ...y: any[]) => any
	private keyExtension: (key: K, index?: number, keys?: K[]) => any

	private getIndexWithChange(sought: any) {
		const size = this.size
		for (let i = 0; i < size; ++i)
			if (this.change!(this.alteredKeys[i], sought)) return i
		return BadIndex
	}

	private getIndexWithoutChange(sought: any) {
		return this.alteredKeys.indexOf(sought)
	}

	private indexOf(sought: any) {
		return this.change
			? this.getIndexWithChange(sought)
			: this.getIndexWithoutChange(sought)
	}

	private getValueIfGood(index: number) {
		return isGoodIndex(index) ? this.values[index] : this.default
	}

	protected setExtension(extension: (x: any, ...y: any[]) => any) {
		this.extension = extension
	}

	protected setChange(change?: IIndexingFunction<K>) {
		this.change = change
	}

	protected setKeyExtension(
		keyExtension: (key: K, index?: number, keys?: K[]) => any
	) {
		this.keyExtension = keyExtension
	}

	get size() {
		return this.keys.length
	}

	index(x: any, ...y: any[]) {
		return this.getValueIfGood(this.indexOf(this.extension(x, ...y)))
	}

	toModifiable() {
		return new TableMap(copy(this.keys), copy(this.values), this.default)
	}

	fromModifiable(table: ITableMap<K, V, Default>) {
		return new this.constructor(table.keys, table.values, table.default)
	}

	copy() {
		return new this.constructor(this.keys, this.values, this.default)
	}

	constructor(keys: K[] = [], values: V[] = [], _default?: Default) {
		assert(isArray(keys))
		assert(isArray(values))
		this.keys = keys
		this.values = values
		this.default = _default!
		this.alteredKeys = this.keys.map(this.keyExtension)
	}
}

export function MapClass<K = any, V = any, Default = any>(
	change?: IIndexingFunction<K>,
	extensions: Function[] = [],
	keyExtensions: Function[] = []
): IMapClass<K, V, Default> {
	const extension = trivialCompose(...extensions)
	const keyExtension = trivialCompose(...keyExtensions)

	class mapClass extends PreMapClass<K, V, Default> {
		static change?: IIndexingFunction<K> = change
		static extend = extend
		static extendKey = extendKey

		static readonly keyExtensions: Function[] = keyExtensions
		static readonly extensions: Function[] = extensions

		constructor(keys?: K[], values?: V[], _default?: Default) {
			super(keys, values, _default)
			this.setChange(change)
			this.setExtension(extension)
			this.setKeyExtension(keyExtension)
		}
	}

	return mapClass
}

export const ArrayMap = MapClass(array.recursiveSame)

export const OptimizedMap = MapClass()

export const OptimizedCharMap = OptimizedMap.extend<number>(string.charCodeAt)

export const PredicateMap: IMapClass<Function> = MapClass(
	(curr: Function, x: any) => curr(x)
)

export const RegExpMap: IMapClass<ITestable> = MapClass(
	(curr: ITestable, x: any) => curr.test(x)
)

export const SetMap: IMapClass<IHaving> = MapClass((curr: IHaving, x: any) =>
	curr.has(x)
)

export const BasicMap = MapClass(equals)

export const ObjectMap = MapClass(object.same)
