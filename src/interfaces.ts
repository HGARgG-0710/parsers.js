import type { Summat } from "@hgargg-0710/summat.ts"
import type { IPersistentAccumulator } from "./interfaces/Accumulator.js"
import type { IHash } from "./interfaces/HashMap.js"

/**
 * This is an interface for representing objects that
 * are copiable. Copying is a default mechanism by which
 * object state is inherited in the course of testing
 * (since the library, primarily, employs state testing,
 * not behaviour testing, and most objects are highly
 * stateful).
 */
export interface ICopiable {
	copy: () => this
}

/**
 * This is a granularization of the `Set` class's interface.
 * Has `has(x: any): boolean` method.
 */
export interface IHaving {
	has: (x: any) => boolean
}

/**
 * This is a granularization of the `RegExp` class's interface.
 * Has `test(x: any): boolean` method.
 */
export interface ITestable {
	test: (x: any) => boolean
}

/**
 * This is a type for functions used by the `MapClass`
 * for representation of elementary searching operations.
 */
export type IIndexingFunction<Key = any> = (curr: Key, x: any) => boolean

/**
 * Represents an entity with a numerical `readonly size`.
 */
export interface ISizeable {
	readonly size: number
}

/**
 * Represents an entity with a `readonly default: T`
 */
export interface IDefaulting<T = any> {
	readonly default: T
}

/**
 * Represents an entity with a write-access
 * over `K` for keys/indexation, and `V` for
 * writable values. The `.set(key: K, value: V): this`
 * method is reponsible for this.
 */
export interface ISettable<K = any, V = any> {
	set: (key: K, value: V) => this
}

/**
 * Respresents an entity with a delete-access
 * over `K` for keys/indexation. The `delete(key: K): this`
 * method is responsible for this.
 */
export interface IDeletable<K = any> {
	delete: (key: K) => this
}

/**
 * Represents an entity with ability to
 * change keys of a prior written entity
 * over `K` for keys/indexation. The
 * `rekey(from: K, to: K): this` is responsible
 * for this.
 */
export interface IRekeyable<K = any> {
	rekey: (fromKey: K, toKey: K) => this
}

/**
 * An interface for representing an object,
 * holding a `hash: IHash<K, InternalKey>`.
 */
export interface IHashable<K = any, InternalKey = any> {
	readonly hash: IHash<K, InternalKey>
}

/**
 * Represents an `Iterable<T>` item that can be indexed
 * via `number`s to obtain values of type `T`,
 * as well as a `.length: number` property.
 */
export type IIndexed<T = any> = {
	[x: number]: T
	length: number
} & Iterable<T>

/**
 * Represents an entity with some sort of `readonly state: T`
 */
export interface IStateful<T extends Summat = Summat> {
	readonly state: T
}

/**
 * Represents an item with `get(): T` method,
 * presumably for some form of encapsulation.
 */
export interface IGettable<T = any> {
	get: () => T
}

/**
 * Represents an item that can be initialized with the
 * given `Args`. The `init(...x: [] | Partial<Args>): this`
 * is responsible for this.
 */
export interface IInitializable<Args extends any[] = any[]> {
	init: (...x: [] | Partial<Args>) => this
}

/**
 * Represents an entity that can be "reversed"
 * in some way. The `reverse(): this` method is
 * responsible for this.
 */
export interface IReversible {
	reverse: () => this
}

/**
 * An interface representing an entity with
 * an `.index(x: any, ...y: any[]) => V`.
 * Serves as the most granular interface
 * for table-objects of the library.
 */
export interface IIndexable<V = any> {
	index: (x: any, ...y: any[]) => V
}

/**
 * This is an interface for representing
 * objects that have an explicit (optional) `toJSON`
 * method.
 */
export type ISerializableObject = { toJSON?: () => any }

/**
 * This is a nominal type to represent
 * all the possible values that can be
 * successfully serialized using `JSON.stringify`
 */
export type ISerializable =
	| ISerializableObject
	| null
	| number
	| string
	| boolean
	| ISerializable[]
	| Number
	| String
	| Boolean

/**
 * This is an interface for representing entities
 * that can be "frozen", and have a method `freeze(): this`,
 * and a `readonly isFrozen: boolean` property
 */
export interface IFreezable {
	readonly isFrozen: boolean
	freeze: () => this
}

/**
 * This is an interface for representing entities that
 * can be "unfrozen", and have a method `unfreeze(): this`
 */
export interface IUnfreezable {
	unfreeze: () => this
}

/**
 * This is an interface for entities with some form of
 * read-access, achieved via the `.read(i: number): T`
 * method.
 */
export interface IReadable<T = any> {
	read(i: number): T
}

/**
 * This is a type for representing entities that
 * can successfully be parsed. They must be:
 *
 * 1. readable
 * 2. sizeable
 * 3. copiable
 */
export type IParseable<T = any> = IReadable<T> & ISizeable & ICopiable

/**
 * This is an interface for entities that have their contents
 * saved to some `readonly buffer: IPersistentAccumulator<T>`.
 */
export interface IBufferized<T = any> {
	readonly buffer: IPersistentAccumulator<T>
}

/**
 * This is an interface representing items with
 * the ability for write-access to the very end
 * via pushing new elements of type `T`. Achieved
 * via the method `push(...items: T[]): this`.
 */
export interface IPushable<T = any> {
	push: (...items: T[]) => this
}

/**
 * An interface for representing entities with
 * some form of write access via the method
 * `write(i: number, value: T): this`.
 */
export interface IWritable<T = any> {
	write: (i: number, value: T) => this
}

/**
 * An interface for representing entities
 * with the ability to store state via the
 * `setState(state: Summat): void` method.
 */
export interface IStateSettable {
	setState(state: Summat): void
}

/**
 * An interface for representing entities,
 * which can be "cleared" via the `clear(): void`
 * method.
 */
export interface IClearable {
	clear(): void
}

/**
 * An interface for representing
 * resources that can be cleaned up
 * via the `.cleanup(): void` method.
 */
export interface IResource {
	cleanup(): void
}

/**
 * This is an interface for entities
 * in possession of `readonly isOpen: boolean`
 * property indicating some kind of openness.
 * Typically applied to resources.
 */
export interface IIsOpen {
	readonly isOpen: boolean
}

/**
 * This is a type alias for entities that
 * are both `ISizeable` and `IWritable<T>`.
 */
export type IFiniteWritable<T = any> = ISizeable & IWritable<T>

// ignore this
export interface IRecursiveListIdentifiable {
	readonly isRecursiveInitList?: boolean
}

// and this also
export interface ISwitchIdentifiable {
	readonly isSwitch?: boolean
}

/**
 * This is an interface for representing entities that
 * have the capability of being "concatenated" to something
 * of type `In` to produce a something of type `Out` via
 * the `concat(x: In): Out` method.
 */
export interface IConcattable<In = any, Out = any> {
	concat: (x: In) => Out
}

export type * from "./interfaces/Accumulator.js"
export type * from "./interfaces/Array.js"
export type * from "./interfaces/Collection.js"
export type * from "./interfaces/Decoder.js"
export type * from "./interfaces/Destination.js"
export type * from "./interfaces/DynamicParser.js"
export type * from "./interfaces/Encoder.js"
export type * from "./interfaces/HashMap.js"
export type * from "./interfaces/Initializer.js"
export type * from "./interfaces/MapClass.js"
export type * from "./interfaces/Node.js"
export type * from "./interfaces/PoolGetter.js"
export type * from "./interfaces/Position.js"
export type * from "./interfaces/Source.js"
export type * from "./interfaces/Stream.js"
export type * from "./interfaces/StreamHandler.js"
export type * from "./interfaces/TableMap.js"
