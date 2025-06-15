import {
	array,
	boolean,
	functional,
	inplace,
	object,
	string,
	type
} from "@hgargg-0710/one"
import assert from "assert"
import { BadIndex } from "../../../constants.js"
import type {
	IHaving,
	IIndexingFunction,
	ITestable
} from "../../../interfaces.js"
import type { IIndexMap, IMapClass } from "../../../interfaces/IndexMap.js"
import { BaseIndexMap } from "../../../internal/IndexMap.js"
import { Pairs } from "../../../samples.js"
import { isGoodIndex } from "../../../utils.js"

const { isArray } = type
const { trivialCompose } = functional
const { equals } = boolean
const { insert, out } = inplace

function plainGetIndex<K = any, V = any>(this: IIndexMap<K, V>, key: any) {
	return (this as any).alteredKeys.indexOf(key)
}

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
	extends BaseIndexMap<K, V, Default>
	implements IIndexMap<K, V, Default>
{
	private alteredKeys: any[]
	private change?: IIndexingFunction<K>
	private extension: (x: any, ...y: any[]) => any
	private keyExtension: (key: K, index?: number, keys?: K[]) => any

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

	index(x: any, ...y: any[]) {
		const valueIndex = this.getIndex(this.extension(x, ...y))
		return isGoodIndex(valueIndex) ? this.values[valueIndex] : this.default
	}

	replace(index: number, pair: [K, V]) {
		if (isGoodIndex(index) && index < this.size) {
			const [key, value] = pair
			this.keys[index] = key
			this.alteredKeys[index] = this.keyExtension(key, index, this.keys)
			this.values[index] = value
		}
		return this
	}

	concat(x: Iterable<[K, V]>): [K[], V[]] {
		const kv = super.concat(x)
		const [keys] = kv
		this.alteredKeys.push(...keys.map(this.keyExtension))
		return kv
	}

	add(index: number, ...pairs: array.Pairs<K, V>) {
		const kv = super.add(index, ...pairs)
		const [keys] = kv
		insert(this.alteredKeys, index, ...keys.map(this.keyExtension))
		return kv
	}

	delete(index: number, count: number = 1) {
		super.delete(index, count)
		out(this.alteredKeys, index, count)
		return this
	}

	rekey(keyFrom: K, keyTo: K) {
		const replacementIndex = this.keys.indexOf(keyFrom)
		this.keys[replacementIndex] = keyTo
		this.alteredKeys[replacementIndex] = this.keyExtension(keyTo)
		return this
	}

	getIndex(sought: any) {
		const size = this.size
		for (let i = 0; i < size; ++i)
			if (this.change!(this.alteredKeys[i], sought)) return i
		return BadIndex
	}

	unique() {
		const indexes = super.unique()
		this.alteredKeys = indexes.map((x) => this.alteredKeys[x])
		return indexes
	}

	constructor(pairsList: array.Pairs<K, V> = [], _default?: Default) {
		assert(isArray(pairsList))
		const [keys, values] = Pairs.from(pairsList)
		super(keys, values, _default)
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

		constructor(pairsList: array.Pairs<K, V> = [], _default?: Default) {
			super(pairsList, _default)
			this.setChange(change)
			this.setExtension(extension)
			this.setKeyExtension(keyExtension)
		}
	}

	if (!change) mapClass.prototype.getIndex = plainGetIndex<K, V>

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
