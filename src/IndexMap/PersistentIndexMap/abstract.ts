import type { IndexMap } from "../interfaces.js"
import type { array } from "@hgargg-0710/one"

import { PreIndexMap } from "../abstract.js"
import { DelegateKeyReplaceable } from "../LookupTable/abstract.js"

import { object } from "@hgargg-0710/one"
const { mixin } = object.classes

abstract class FakeIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexGetType = any
> extends DelegateKeyReplaceable<
	KeyType,
	ValueType,
	IndexMap<KeyType, ValueType, any, number>,
	number
> {
	abstract getIndex(key: any): IndexGetType
	abstract add(index: number, ...pairs: array.Pairs<KeyType, ValueType>): this
	abstract copy(): IndexMap<KeyType, ValueType, DefaultType, IndexGetType>
	abstract swap(i: number, j: number): this
	abstract unique(): number[]

	// * note: these are fakes - see the comment at the bottom...
	[Symbol.iterator]: () => Generator<array.Pair<KeyType, ValueType>>
	set(key: KeyType, value: ValueType): any {}
	get size(): number {
		return 0
	}
	reverse(): any {}
}

export abstract class DelegateIndexMap<
		KeyType = any,
		ValueType = any,
		DefaultType = any,
		IndexGetType = any
	>
	extends FakeIndexMap<KeyType, ValueType, DefaultType, IndexGetType>
	implements PreIndexMap<KeyType, ValueType, DefaultType, IndexGetType>
{
	delete(key: number, count?: number) {
		this.value.delete(key, count)
		return this
	}

	index(x: any, ...y: any[]) {
		return this.value.index(x, ...y)
	}

	byIndex(index: number) {
		return this.value.byIndex(index)
	}

	replace(index: number, pair: [KeyType, ValueType]) {
		this.value.replace(index, pair)
		return this
	}

	get default() {
		return this.value.default
	}

	get values() {
		return this.value.values
	}

	get keys() {
		return this.value.keys
	}
}

// * This is where the real implementations of the empty FakeIndexMap methods come from.
mixin(DelegateIndexMap, [PreIndexMap])
