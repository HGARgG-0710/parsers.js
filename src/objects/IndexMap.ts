import { array, functional, object, type } from "@hgargg-0710/one"
import { BadIndex } from "../constants.js"
import type { IHaving, IPredicate, ITestable } from "../interfaces.js"
import type { IIndexMap, IMidMap } from "../interfaces/IndexMap.js"
import type {
	ILiquidMap,
	ITableCarrier
} from "../modules/IndexMap/interfaces/LiquidMap.js"
import { LiquidMap } from "../modules/IndexMap/objects/LiquidMap.js"

const { isArray } = type
const { trivialCompose, id } = functional

type IKeyExtension<K = any, RealKey = any> = (key: K) => RealKey

type IExtension<Index = any> = (x: Index, ...y: any[]) => any

/**
 * This is a class for representing an encapsulated,
 * re-computable and cacheable function-composition,
 * consisting of the various `Function`s provided by the
 * user in the constructor via the `public readonly components: Function[]`
 * array.
 *
 * One can append a new item at the end, producing a new function-array
 * that can be used to create a new `FunctionComposition` object.
 */
class FunctionComposition<Args extends any[] = any[], Out = any> {
	private composed: (...args: Args) => Out

	withFront<In = any>(component: (input: In) => any) {
		return this.components.concat(component)
	}

	calc() {
		this.composed = trivialCompose(...this.components)
	}

	get() {
		return this.composed
	}

	constructor(readonly components: Function[] = []) {}
}

/**
 * This is an abstract class implementing the `IMidMap<K, V, Default>` interface,
 * intended to provide default implementation for the `extend` and `extendKey`
 * methods, as well as require the user to implement `finalize` on their
 * own (since that would heavily depend on the concrete implementation
 * of the related `IIndexMap<K, V, Default>`), and encapsulate the
 * `protected readonly` properties `extension` and `keyExtension`
 * [corresponding to the appropriate `protected` setters of the
 * `IndexMap`-deriving concrete classes]. Said properites can [and must!] be
 * calculated and cached inside of the concrete `finalize` implementation
 * of the `MidMap`-deriving class via a call to the `protected calcExtensions(): void`
 * method, otherwise the implementation will not work.
 *
 * The class also encapsulates the `protected readonly liquid: ILiquidMap<K, V, Default>`
 * property that corresponds to the contents of the original table that is being
 * extended via the `IMidMap` interface.
 *
 * The `RealKey` generic parameter is intended to correspond to the same one in the `IndexMap`
 * class - it preserves the parameter of the original keys, one that the table had
 * prior to being extended.
 *
 * A "typical" `finalize` implementation would:
 *
 * 0. perform pre-initialization logic for the `IIndexMap<K, V, Default>` (if any)
 * 1. call `this.calcExtensions()`
 * 2. create and return the new instance of a related `IIndexMap<K, V, Default>`
 * implementation, while passing to it and copying the `this.liquid` via
 * `this.liquid.copy()`
 */
export abstract class MidMap<
	K = any,
	V = any,
	Default = any,
	RealKey = any,
	Index = K
> implements IMidMap<K, V, Default, Index> {
	private ["constructor"]: new <
		K = any,
		V = any,
		Default = any,
		RealKey = any,
		Index = any
	>(
		extension?: Function[],
		keyExtension?: Function[],
		liquid?: ILiquidMap<K, V, Default>
	) => MidMap<K, V, Default, RealKey, Index>

	private readonly preExtension: FunctionComposition<[any, ...any[]], any>
	private readonly preKeyExtension: FunctionComposition<[K], RealKey>

	private calcExtensions() {
		this.preExtension.calc()
		this.preKeyExtension.calc()
	}

	protected get extension() {
		return this.preExtension.get()
	}

	protected get keyExtension() {
		return this.preKeyExtension.get()
	}

	protected abstract getMapInstance(): IndexMap<K, V, Default, RealKey, Index>

	finalize(): IndexMap<K, V, Default, RealKey, Index> {
		this.calcExtensions()
		return this.getMapInstance()
			.setExtension(this.extension)
			.setKeyExtension(this.keyExtension)
	}

	extend<NI = any>(
		f: (newKey: NI) => Index
	): MidMap<K, V, Default, RealKey, NI> {
		return new this.constructor(
			this.preExtension.withFront(f),
			this.preKeyExtension.components,
			this.liquid
		)
	}

	extendKey<NK = any>(
		f: (newKey: NK) => K
	): MidMap<NK, V, Default, RealKey, Index> {
		return new this.constructor(
			this.preExtension.components,
			this.preKeyExtension.withFront(f)
		)
	}

	constructor(
		extension: Function[] = [],
		keyExtension: Function[] = [],
		protected readonly liquid: ILiquidMap<K, V, Default> = new LiquidMap()
	) {
		this.preExtension = new FunctionComposition(extension)
		this.preKeyExtension = new FunctionComposition(keyExtension)
	}
}

/**
 * This is an abstract class implementing the `IIndexMap<K, V, Default>`
 * interface. It is an `IIndexable<V | Default>`, and can be used to
 * (linearly) walk through the list of currently available keys, applying
 * the highly diverse `protected comparator(key: RealKey, x: any): boolean`,
 * on the given `x: any`, with each one of its keys "stripped down" to their
 * original `RealKey` form which is to be implemented
 * by the concrete children-classes. This form is obtainable via the
 * internal `keyExtension` property, settable by the children classes
 * via the `protected setKeyExtension(keyExtension: (key: K) => RealKey): this`
 * method.
 *
 * Similarly, there is a same kind of `extension` function-property for
 * inputs `sought: any, ...y: any[]` of the `index(sought: any, ...y: any[]): V | Default`
 * method, producing a value of a type acceptable as the second type-parameter
 * of the `comparator` method [note: that the type-correctness-verification
 * here is entirely on the user, since, in some situations, it would be
 * considerably more performant, simple and readable to just omit it,
 * as, due to the dynamic nature of JavaScript, invalid input cases
 * would resolve themselves automatically via returning of the `Default` value].
 *
 * Alternatively, the children claseses may also override the
 * `protected indexOf(sought: any): number`, which is run on
 * an item inside of `index(sought: any): V | Default` after it
 * has been exposed to the "extension" function. In this case,
 * they have access to the `protected realKeys: RealKey[]`
 * property of `IndexMap`, it being the cached list of
 * `.keys` contained within the underlying `ILiquidMap<K, V, Default>`
 * [used in the constructor as a mean to transfer initial data
 * under the control of an `IndexMap` instance]. This option
 * specifically is useful if the nature of the keys permits
 * the user to optimize the search to run in a better
 * algorithmic (or practical) time.
 */
export abstract class IndexMap<
	K = any,
	V = any,
	Default = any,
	RealKey = K,
	Index = K
> implements IIndexMap<K, V, Default, Index> {
	private ["constructor"]: new (liquid: ILiquidMap<any, any, Default>) => this

	private carrier: ITableCarrier<K, V, Default>
	private _realKeys: RealKey[]

	protected comparator?(curr: RealKey, x: any): boolean

	private extension: IExtension<Index> = id
	private keyExtension: IKeyExtension<K, RealKey> = id as any

	private initCarrier() {
		this.carrier = this.liquid.toCarrier()
	}

	private updateCarrier() {
		this.initCarrier()
		this.initExtendedKeys()
	}

	private initExtendedKeys() {
		this.realKeys = this.keys.map(this.keyExtension)
	}

	setExtension(extension: (x: any, ...y: any[]) => any) {
		this.extension = extension
		return this
	}

	setKeyExtension(keyExtension: IKeyExtension<K, RealKey>) {
		this.keyExtension = keyExtension
		this.initExtendedKeys()
		return this
	}

	private set realKeys(realKeys: RealKey[]) {
		this._realKeys = realKeys
	}

	protected get realKeys() {
		return this._realKeys
	}

	// ! PRE-DOC: important extra-flexibility hook - DO NOT MISS!
	// * NOTE: this is made `protected` to allow algorithm replacement in
	// * child classes. Same goes for the `keysExtended` accessor
	protected indexOf(sought: any) {
		const size = this.size
		for (let i = 0; i < size; ++i)
			if (this.comparator!(this.realKeys[i], sought)) return i
		return BadIndex
	}

	get size() {
		return this.keys.length
	}

	get keys() {
		return this.carrier.keys
	}

	get default() {
		return this.carrier.default
	}

	index(x: Index, ...y: any[]) {
		return this.carrier.read(this.indexOf(this.extension(x, ...y)))
	}

	toModifiable() {
		return this.liquid.toModifiable()
	}

	fromCarrier(carrier: ITableCarrier<K, V, Default>): this {
		this.liquid.fromCarrier(carrier)
		this.updateCarrier()
		return this
	}

	copy() {
		return new this.constructor(this.liquid.copy())
	}

	constructor(protected readonly liquid: ILiquidMap<K, V, Default>) {
		this.initCarrier()
	}
}

export namespace IndexMap {
	/**
	 * This is an `IndexMap`, which has its instances recursively compare the
	 * array-shaped keys to the passed `.index` argument without [initially]
	 * transforming it. The `.extend/.extendKey` methods on it are standard.
	 */
	export class ArrayMap<
		K,
		V,
		Default,
		RealKey extends any[] = K extends any[] ? K : K[],
		Index = K
	> extends IndexMap<K, V, Default, RealKey, Index> {
		private static MidMap = class<
			K = any,
			V = any,
			Default = any,
			RealKey extends any[] = any,
			Index = K
		> extends MidMap<K, V, Default, RealKey, Index> {
			protected getMapInstance(): ArrayMap<
				K,
				V,
				Default,
				RealKey,
				Index
			> {
				return new ArrayMap<K, V, Default, RealKey, Index>(this.liquid)
			}
		}

		static extend<
			NI,
			K,
			V,
			Default,
			RealKey extends any[] = K extends any[] ? K : K[],
			Index = K
		>(f: (newIndexed: NI) => Index): MidMap<K, V, Default, RealKey, NI> {
			return new ArrayMap.MidMap<K, V, Default, RealKey, NI>([f])
		}

		static extendKey<
			NK,
			K,
			V,
			Default,
			RealKey extends any[] = any,
			Index = K
		>(f: (newKey: NK) => K): MidMap<NK, V, Default, RealKey, Index> {
			return new ArrayMap.MidMap<NK, V, Default, RealKey, Index>([], [f])
		}

		protected override comparator(curr: RealKey, x: any): boolean {
			return isArray(x) && array.recursiveSame(curr, x)
		}
	}

	/**
	 * This is an `IndexMap` without any special properties. It simply
	 * traverses the current key-value list, comparing the given input
	 * to the keys via the `===` operator. The `.extend/extendKey` methods
	 * are standard.
	 */
	export class BasicMap<
		K = any,
		V = any,
		Default = any,
		RealKey = any,
		Index = K
	> extends IndexMap<K, V, Default, RealKey, Index> {
		private static MidMap = class<
			K = any,
			V = any,
			Default = any,
			RealKey = any,
			Index = K
		> extends MidMap<K, V, Default, RealKey, Index> {
			protected getMapInstance(): BasicMap<
				K,
				V,
				Default,
				RealKey,
				Index
			> {
				return new BasicMap<K, V, Default, RealKey, Index>(this.liquid)
			}
		}

		static extend<
			NI = any,
			K = any,
			V = any,
			Default = any,
			RealKey = any,
			Index = K
		>(f: (newIndexed: NI) => Index): MidMap<K, V, Default, RealKey, NI> {
			return new BasicMap.MidMap<K, V, Default, RealKey, NI>([f])
		}

		static extendKey<
			NK = any,
			K = any,
			V = any,
			Default = any,
			RealKey = any,
			Index = K
		>(f: (newKey: NK) => K): MidMap<NK, V, Default, RealKey, Index> {
			return new BasicMap.MidMap<NK, V, Default, RealKey, Index>([], [f])
		}

		protected override indexOf(sought: any): number {
			return this.realKeys.indexOf(sought)
		}
	}

	/**
	 * This is an `IndexMap`, instances of which have predicates for
	 * keys. It has no `.extension/.keyExtension` and iterates the keys, looking for
	 * the first to return a "truthy" value when given the user-provided input.
	 * The `.extend/extendKey` methods are standard.
	 */
	export class PredicateMap<
		T = any,
		Default = any,
		K = IPredicate<T>,
		Index = any
	> extends IndexMap<K, T, Default, IPredicate<T>, Index> {
		private static MidMap = class<
			T = any,
			Default = any,
			K = IPredicate<T>,
			Index = any
		> extends MidMap<K, T, Default, IPredicate<T>, Index> {
			protected getMapInstance(): PredicateMap<T, Default, K, Index> {
				return new PredicateMap<T, Default, K, Index>(
					this.liquid.copy()
				)
			}
		}

		static extend<
			NI = any,
			T = any,
			Default = any,
			K = IPredicate<T>,
			Index = any
		>(
			f: (newIndexed: NI) => Index
		): MidMap<K, T, Default, IPredicate<T>, NI> {
			return new PredicateMap.MidMap<T, Default, K, NI>([f])
		}

		static extendKey<
			NK = any,
			T = any,
			Default = any,
			K = IPredicate<T>,
			Index = any
		>(f: (newKey: NK) => K): MidMap<NK, T, Default, IPredicate<T>, Index> {
			return new PredicateMap.MidMap<T, Default, NK, Index>([], [f])
		}

		protected override comparator(curr: IPredicate<T>, x: T): boolean {
			return curr(x)
		}
	}

	/**
	 * This is an `IndexMap` with no default key-transformations,
	 * instances of which have `ITestable<T>`s [for instance - regular expressions]
	 * for "real" keys. Its instances walk through the key list, running `curr.test(x)`
	 * on the input `x` for every `curr: ITestable` among the keys.
	 * The `.extend/extendKey` methods are standard.
	 */
	export class RegExpMap<
		T = any,
		Default = any,
		K = ITestable<T>,
		Index = string
	> extends IndexMap<K, T, Default, ITestable<T>, Index> {
		private static MidMap = class<
			T = any,
			Default = any,
			K = ITestable<T>,
			Index = string
		> extends MidMap<K, T, Default, ITestable<T>, Index> {
			protected getMapInstance(): RegExpMap<T, Default, K, Index> {
				return new RegExpMap<T, Default, K, Index>(this.liquid.copy())
			}
		}

		static extend<
			NI = any,
			T = any,
			Default = any,
			K = ITestable<T>,
			Index = string
		>(
			f: (newIndexed: NI) => Index
		): MidMap<K, T, Default, ITestable<T>, NI> {
			return new RegExpMap.MidMap<T, Default, K, NI>([f])
		}

		static extendKey<
			NK = any,
			T = any,
			Default = any,
			K = ITestable<T>,
			Index = string
		>(f: (newKey: NK) => K): MidMap<NK, T, Default, ITestable<T>, Index> {
			return new RegExpMap.MidMap<T, Default, NK, Index>([], [f])
		}

		protected override comparator(curr: ITestable<T>, x: T): boolean {
			return curr.test(x)
		}
	}

	/**
	 * This is an `IndexMap` with no default key-transformation,
	 * whose keys are `IHaving<T>` [`Set<T>`s, for instance] for "real" keys.
	 * Its instances walk through the key list, running `curr.has(x)`
	 * on the input `x` for every `curr: IHaving<T>` among the keys.
	 * The `.extend/extendKey` methods are standard.
	 */
	export class SetMap<
		T = any,
		Default = any,
		K = IHaving<T>,
		Index = any
	> extends IndexMap<K, T, Default, IHaving<T>, Index> {
		private static MidMap = class<
			T = any,
			Default = any,
			K = IHaving<T>,
			Index = any
		> extends MidMap<K, T, Default, IHaving<T>, Index> {
			protected getMapInstance(): SetMap<T, Default, K, Index> {
				return new SetMap<T, Default, K, Index>(this.liquid.copy())
			}
		}

		static extend<
			NI = any,
			T = any,
			Default = any,
			K = IHaving<T>,
			Index = any
		>(f: (newIndexed: NI) => Index): MidMap<K, T, Default, IHaving<T>, NI> {
			return new SetMap.MidMap<T, Default, K, NI>([f])
		}

		static extendKey<
			NK = any,
			T = any,
			Default = any,
			K = IHaving<T>,
			Index = any
		>(f: (newKey: NK) => K): MidMap<NK, T, Default, IHaving<T>, Index> {
			return new SetMap.MidMap<T, Default, NK>([], [f])
		}

		protected override comparator(curr: IHaving<T>, x: T): boolean {
			return curr.has(x)
		}
	}

	/**
	 * This is an `IndexMap` with no default key-transformation,
	 * whose "real" keys are objects that are compared via their keys' and
	 * values' lists [including order of items] element-by-element
	 * via `===` [note: non-recursively]. The `.extend/extendKey` methods
	 * are standard.
	 */
	export class ObjectMap<
		T = any,
		Default = any,
		K = object,
		Index = K
	> extends IndexMap<K, T, Default, object, Index> {
		private static MidMap = class<
			T = any,
			Default = any,
			K = object,
			Index = K
		> extends MidMap<K, T, Default, object, Index> {
			protected getMapInstance(): ObjectMap<T, Default, K, Index> {
				return new ObjectMap<T, Default, K, Index>(this.liquid.copy())
			}
		}

		static extend<NI = any, T = any, Default = any, K = object, Index = K>(
			f: (newIndexed: NI) => Index
		): MidMap<K, T, Default, object, NI> {
			return new ObjectMap.MidMap<T, Default, K, NI>([f])
		}

		static extendKey<
			NK = any,
			T = any,
			Default = any,
			K = object,
			Index = K
		>(f: (newKey: NK) => K): MidMap<NK, T, Default, object, Index> {
			return new ObjectMap.MidMap<T, Default, NK, Index>([], [f])
		}

		protected override comparator(curr: object, x: any): boolean {
			return object.same(curr, x)
		}
	}
}

export * from "../modules/IndexMap/objects/LiquidMap.js"
export * from "../modules/IndexMap/objects/ModifiableMap.js"
export * from "../modules/IndexMap/objects/TableMap.js"
