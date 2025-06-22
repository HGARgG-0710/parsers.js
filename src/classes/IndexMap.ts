import { array, functional, object } from "@hgargg-0710/one"
import { BadIndex } from "../constants.js"
import type { IHaving, IPredicate, ITestable } from "../interfaces.js"
import type { IIndexMap, IMidMap } from "../interfaces/IndexMap.js"
import type {
	ILiquidMap,
	ITableCarrier
} from "../modules/IndexMap/interfaces/LiquidMap.js"

const { trivialCompose, id } = functional

type IKeyExtension<K = any, RealKey = any> = (key: K) => RealKey

type IExtension = (x: any, ...y: any[]) => any

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

	constructor(public readonly components: Function[] = []) {}
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
export abstract class MidMap<K = any, V = any, Default = any, RealKey = any>
	implements IMidMap<K, V, Default>
{
	protected ["constructor"]: new <
		K = any,
		V = any,
		Default = any,
		RealKey = any
	>(
		liquid: ILiquidMap<K, V, Default>,
		extension: Function[],
		keyExtension: Function[]
	) => MidMap<K, V, Default, RealKey>

	private readonly preExtension: FunctionComposition<[any, ...any[]], any>
	private readonly preKeyExtension: FunctionComposition<[K], RealKey>

	protected calcExtensions() {
		this.preExtension.calc()
		this.preKeyExtension.calc()
	}

	protected get extension() {
		return this.preExtension.get()
	}

	protected get keyExtension() {
		return this.preKeyExtension.get()
	}

	abstract finalize(): IIndexMap<K, V, Default>

	extend<NV = any>(f: (newKey: NV) => V): MidMap<K, V, Default, RealKey> {
		return new this.constructor(
			this.liquid,
			this.preExtension.withFront(f),
			this.preKeyExtension.components
		)
	}

	extendKey<NK = any>(f: (newKey: NK) => K): MidMap<NK, V, Default, RealKey> {
		return new this.constructor(
			this.liquid,
			this.preExtension.components,
			this.preKeyExtension.withFront(f)
		)
	}

	constructor(
		protected readonly liquid: ILiquidMap<any, any, Default>,
		extension: Function[] = [],
		keyExtension: Function[] = []
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
export abstract class IndexMap<K = any, V = any, Default = any, RealKey = K>
	implements IIndexMap<K, V, Default>
{
	private ["constructor"]: new (liquid: ILiquidMap<any, any, Default>) => this

	private carrier: ITableCarrier<K, V, Default>
	private _realKeys: RealKey[]

	protected comparator?(curr: RealKey, x: any): boolean

	abstract extendKey<NK = any>(
		f: (newKey: NK) => K
	): MidMap<NK, V, Default, RealKey>

	abstract extend(f: (newIndexed: any) => any): MidMap<K, V, Default, RealKey>

	private extension: IExtension = id
	private keyExtension: IKeyExtension<K, RealKey> = id as any

	private get size() {
		return this.keys.length
	}

	private get keys() {
		return this.carrier.keys
	}

	private initCarrier() {
		this.carrier = this.liquid.toCarrier()
	}

	private updateCarrier() {
		this.initCarrier()
		this.initExtendedKeys()
	}

	private initExtendedKeys() {
		this._realKeys = this.keys.map(this.keyExtension)
	}

	protected setExtension(extension: (x: any, ...y: any[]) => any) {
		this.extension = extension
		return this
	}

	protected setKeyExtension(keyExtension: IKeyExtension<K, RealKey>) {
		this.keyExtension = keyExtension.bind(this)
		this.initExtendedKeys()
		return this
	}

	protected get realKeys() {
		return this._realKeys
	}

	// * NOTE: this is made `protected` to allow algorithm replacement in
	// * child classes. Same goes for the `keysExtended` accessor
	protected indexOf(sought: any) {
		const size = this.size
		for (let i = 0; i < size; ++i)
			if (this.comparator!(this.realKeys[i], sought)) return i
		return BadIndex
	}

	get default() {
		return this.carrier.default
	}

	index(x: any, ...y: any[]) {
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
		RealKey extends any[] = K extends any[] ? K : any[]
	> extends IndexMap<K, V, Default, RealKey> {
		private static MidMap = class<
			K = any,
			V = any,
			Default = any,
			RealKey extends any[] = any
		> extends MidMap<K, V, Default, RealKey> {
			finalize(): ArrayMap<K, V, Default, RealKey> {
				this.calcExtensions()
				return new ArrayMap<K, V, Default, RealKey>(this.liquid)
					.setExtension(this.extension)
					.setKeyExtension(this.keyExtension)
			}
		}

		protected comparator(curr: RealKey, x: any): boolean {
			return array.recursiveSame(curr, x)
		}

		extend(f: (newKey: any) => any): MidMap<K, V, Default, RealKey> {
			return new ArrayMap.MidMap<K, V, Default, RealKey>(
				this.liquid.copy(),
				[f]
			)
		}

		extendKey<NK = any>(
			f: (newKey: NK) => K
		): MidMap<NK, V, Default, RealKey> {
			return new ArrayMap.MidMap<NK, V, Default>(
				this.liquid.copy(),
				[],
				[f]
			)
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
		RealKey = any
	> extends IndexMap<K, V, Default, RealKey> {
		private static MidMap = class<
			K = any,
			V = any,
			Default = any,
			RealKey = any
		> extends MidMap<K, V, Default, RealKey> {
			finalize(): BasicMap<K, V, Default, RealKey> {
				this.calcExtensions()
				return new BasicMap<K, V, Default, RealKey>(this.liquid)
					.setExtension(this.extension)
					.setKeyExtension(this.keyExtension)
			}
		}

		protected indexOf(sought: any): number {
			return this.realKeys.indexOf(sought)
		}

		extend(f: (newIndexed: any) => any): MidMap<K, V, Default, RealKey> {
			return new BasicMap.MidMap<K, V, Default, RealKey>(
				this.liquid.copy(),
				[f]
			)
		}

		extendKey<NK = any>(
			f: (newKey: NK) => K
		): MidMap<NK, V, Default, RealKey> {
			return new BasicMap.MidMap<NK, V, Default, RealKey>(
				this.liquid.copy(),
				[],
				[f]
			)
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
		K = IPredicate<T>
	> extends IndexMap<K, T, Default, IPredicate<T>> {
		private static MidMap = class<
			T = any,
			Default = any,
			K = IPredicate<T>
		> extends MidMap<K, T, Default, IPredicate<T>> {
			finalize(): PredicateMap<T, Default, K> {
				this.calcExtensions()
				return new PredicateMap<T, Default, K>(this.liquid.copy())
					.setExtension(this.extension)
					.setKeyExtension(this.keyExtension)
			}
		}

		protected comparator(curr: IPredicate<T>, x: any): boolean {
			return curr(x)
		}

		extend(
			f: (newIndexed: any) => any
		): MidMap<K, T, Default, IPredicate<T>> {
			return new PredicateMap.MidMap<T, Default, K>(this.liquid.copy(), [
				f
			])
		}

		extendKey<NK = any>(
			f: (newKey: NK) => K
		): MidMap<NK, T, Default, IPredicate<T>> {
			return new PredicateMap.MidMap<T, Default, NK>(
				this.liquid.copy(),
				[],
				[f]
			)
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
		K = ITestable<T>
	> extends IndexMap<K, T, Default, ITestable<T>> {
		private static MidMap = class<
			T = any,
			Default = any,
			K = ITestable<T>
		> extends MidMap<K, T, Default, ITestable<T>> {
			finalize(): RegExpMap<T, Default, K> {
				this.calcExtensions()
				return new RegExpMap<T, Default, K>(this.liquid.copy())
					.setExtension(this.extension)
					.setKeyExtension(this.keyExtension)
			}
		}

		protected comparator(curr: ITestable<T>, x: any): boolean {
			return curr.test(x)
		}

		extend(
			f: (newIndexed: any) => any
		): MidMap<K, T, Default, ITestable<T>> {
			return new RegExpMap.MidMap<T, Default, K>(this.liquid.copy(), [f])
		}

		extendKey<NK = any>(
			f: (newKey: NK) => K
		): MidMap<NK, T, Default, ITestable<T>> {
			return new RegExpMap.MidMap<T, Default, NK>(
				this.liquid.copy(),
				[],
				[f]
			)
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
		K = IHaving<T>
	> extends IndexMap<K, T, Default, IHaving<T>> {
		private static MidMap = class<
			T = any,
			Default = any,
			K = IHaving<T>
		> extends MidMap<K, T, Default, IHaving<T>> {
			finalize(): SetMap<T, Default, K> {
				this.calcExtensions()
				return new SetMap<T, Default, K>(this.liquid.copy())
					.setExtension(this.extension)
					.setKeyExtension(this.keyExtension)
			}
		}

		protected comparator(curr: IHaving<T>, x: any): boolean {
			return curr.has(x)
		}

		extend(f: (newIndexed: any) => any): MidMap<K, T, Default, IHaving<T>> {
			return new SetMap.MidMap<T, Default, K>(this.liquid.copy(), [f])
		}

		extendKey<NK = any>(
			f: (newKey: NK) => K
		): MidMap<NK, T, Default, IHaving<T>> {
			return new SetMap.MidMap<T, Default, NK>(
				this.liquid.copy(),
				[],
				[f]
			)
		}
	}

	/**
	 * This is an `IndexMap` with no default key-transformation,
	 * whose "real" keys are objects that are compared via their keys' and
	 * values' lists [including order of items] element-by-element
	 * via `===` [note: non-recursively]. The `.extend/extendKey` methods
	 * are standard.
	 */
	export class ObjectMap<T = any, Default = any, K = object> extends IndexMap<
		K,
		T,
		Default,
		object
	> {
		private static MidMap = class<
			T = any,
			Default = any,
			K = object
		> extends MidMap<K, T, Default, object> {
			finalize(): ObjectMap<T, Default, K> {
				this.calcExtensions()
				return new ObjectMap<T, Default, K>(this.liquid.copy())
					.setExtension(this.extension)
					.setKeyExtension(this.keyExtension)
			}
		}

		protected comparator(curr: object, x: any): boolean {
			return object.same(curr, x)
		}

		extend(f: (newIndexed: any) => any): MidMap<K, T, Default, object> {
			return new ObjectMap.MidMap<T, Default, K>(this.liquid.copy(), [f])
		}

		extendKey<NK = any>(
			f: (newKey: NK) => K
		): MidMap<NK, T, Default, object> {
			return new ObjectMap.MidMap<T, Default, NK>(
				this.liquid.copy(),
				[],
				[f]
			)
		}
	}
}

export * from "../modules/IndexMap/classes/ModifiableMap.js"
export * from "../modules/IndexMap/classes/TableMap.js"
