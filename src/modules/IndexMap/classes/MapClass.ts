import { array, functional, object, string, type } from "@hgargg-0710/one"
import assert from "assert"
import { BadIndex, MissingArgument } from "../../../constants.js"
import type {
	IHaving,
	IIndexingFunction,
	ITableMap,
	ITestable
} from "../../../interfaces.js"
import type { IIndexMap, IMapClass } from "../../../interfaces/MapClass.js"
import { isGoodIndex } from "../../../utils.js"
import { TableMap } from "../../../internal/TableMap.js"

const { isArray } = type
const { trivialCompose } = functional
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

/**
 * Base class for all the `MapClass`es.
 * Contains relevant methods implementations,
 * as well as `protected` setters, to allow
 * for configuration of their instance objects.
 */
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

	private get size() {
		return this.keys.length
	}

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
		return new this.constructor(
			copy(this.keys),
			copy(this.values),
			this.default
		)
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

/**
 * This is a function for creation of `IMapClass<K, V, Default>`-implementing
 * factories. These are `IIndexMap<K, V, Default>`-classes with some additional
 * static properties.
 *
 * The `.extensions` and `.keyExtension` arrays are composed over the first
 * argument [from 0 to the respective last arrays' indexes] to produce two
 * functions - `.extension` and `.keyExtension` respectively.
 *
 * The configuration-parameters are primarily designed to affect the behaviour
 * of the `.index` method. Here, `.change` serves as a way to linearly compare
 * each key [put through the `.keyExtension(currKey)`] (first arg of `.change`)
 * against the user-provided arguments `x: any, ...y: any[]` that has been put
 * through the `.extension(x, ...y)` (second arg of `.change`). The first key
 * in the collection for which such a call to `.change` shall return `true`
 * is being picked as the correct one. The iteration goes from index `0` to the
 * last available one.
 *
 * Whenever `.change` is absent the call to `.change` is replaced by an `.indexOf`
 * call with a similar functionality [id est, it is as if the user simply passed
 * `(x) => x` instead of ignoring it].
 *
 * The `IMapClass`es themselves can also be `.extend()/.extendKey()`ed to
 * allow for adding new items to the end of `.extensions` and `.keyExtensions`
 * arrays respectively [note: creates a new `IMapClass`]. This exists so
 * that the user could more flexibly compose the different types of inputs
 * from already existing `IMapClass`es.
 *
 * Also note, that the `.fromModifiable(table: ITable<K, V, Default>)` method 
 * DOES NOT copy the `.keys` and `.values`, instead TRANSFERING read-only access 
 * to them to the respective `IIndexMap<K, V, Default>`. The same DOES NOT 
 * hold regarding `.toModifiable()` [meaning - the copying operation does take 
 * place during its call]. This is done because the user is supposed to be using 
 * `ITableMap`s constructed via `.toModifiable` together with instances of the 
 * same class. It is ALSO intended that these `ITableMap` instances either be 
 * temporary [and created/freed ad-hoc], or be employed for a long period of time 
 * with the exact same objects. 
 */
export function MapClass<K = any, V = any, Default = any>(
	change?: IIndexingFunction<K>,
	extensions: Function[] = [],
	keyExtensions: Function[] = []
): IMapClass<K, V, Default> {
	const extension = trivialCompose(...extensions)
	const keyExtension = trivialCompose(...keyExtensions)

	class mapClass extends PreMapClass<K, V, Default> {
		static readonly change?: IIndexingFunction<K> = change
		static readonly extend = extend
		static readonly extendKey = extendKey
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

/**
 * This is an `IMapClass`, which has its instances recursively compare the
 * array-shaped keys to the passed `.index` argument without transforming it.
 */
export const ArrayMap = MapClass(array.recursiveSame)

/**
 * This is an `IMapClass` without any special properties. It simply
 * traverses the current key-value list, comparing the given input
 * to the keys via the `===` operator.
 */
export const BasicMap = MapClass()

/**
 * This is an `IMapClass` without `.change` or `.keyExtension`, which uses
 * `(x: string, i: number) => x.charCodeAt(i)` as an extension.
 * It, thus, expects to have numbers for keys, and `string`s as
 * inputs for the `.index` method.
 */
export const CharCodeMap = MapClass(MissingArgument, [string.charCodeAt])

/**
 * This is an `IMapClass`, instances of which have predicates for
 * keys. It has no `.extension/.keyExtension` and iterates the keys, looking for
 * the first to return a "truthy" value when given the user-provided input.
 */
export const PredicateMap: IMapClass<Function> = MapClass(
	(curr: Function, x: any) => curr(x)
)

/**
 * This is an `IMapClass` without `.extension/.keyExtension`,
 * instances of which have `ITestable`s [for instance - regular expressions]
 * for keys. Its instances walk through the key list, running `curr.test(x)`
 * on the input `x` for every `curr: ITestable` among the keys.
 */
export const RegExpMap: IMapClass<ITestable> = MapClass(
	(curr: ITestable, x: any) => curr.test(x)
)

/**
 * This is an `IMapClass` without `.extension/.keyExtension`,
 * whose keys are `IHaving` [`Set`s, for instance] for keys.
 * Its instances walk through the key list, running `curr.has(x)`
 * on the input `x` for every `curr: IHaving` among the keys.
 */
export const SetMap: IMapClass<IHaving> = MapClass((curr: IHaving, x: any) =>
	curr.has(x)
)

/**
 * This is an `IMapClass` without `.extension/.keyExtension`,
 * whose keys are objects that are compared via their keys'and
 * values' lists [including order of items] element-by-element
 * via `===`.
 */
export const ObjectMap = MapClass(object.same)
