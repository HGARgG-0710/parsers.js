import type { Summat } from "@hgargg-0710/summat.ts"
import type { IPersistentAccumulator } from "./interfaces/Accumulator.js"
import type { IHash } from "./interfaces/HashMap.js"

export type IMappable<T = any, Out = any> = (value: T, index?: number) => Out

export interface ICopiable {
	copy: () => this
}

export interface IHaving {
	has: (x: any) => boolean
}

export interface ITestable {
	test: (x: any) => boolean
}

export type IIndexingFunction<Key = any> = (curr: Key, x: any) => boolean

export interface ISizeable {
	readonly size: number
}

export interface IDefaulting<T = any> {
	readonly default: T
}

export interface ISettable<K = any, V = any> {
	set: (key: K, value: V) => this
}

export interface IDeletable<K = any> {
	delete: (key: K) => this
}

export interface IRekeyable<KeyType = any> {
	rekey: (fromKey: KeyType, toKey: KeyType) => this
}

export interface IHashable<K, InternalKey> {
	hash: IHash<K, InternalKey>
}

export type IIndexed<T = any> =
	| {
			[x: number]: T
			length: number
	  } & Iterable<T>

export interface IStateful<T extends Summat = Summat> {
	readonly state: T
}

export interface IGettable<T = any> {
	get: () => T
}

export interface IInitializable<Args extends any[] = any[]> {
	init: (...x: [] | Partial<Args>) => this
}

export interface IReversible {
	reverse: () => this
}

export interface IIndexable<V = any> {
	index: (x: any, ...y: any[]) => V
}

export type ISerializableObject = { toJSON: () => string }

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

export interface IFreezable {
	readonly isFrozen: boolean
	freeze: () => this
}

export interface IUnfreezable {
	unfreeze: () => this
}

export interface IReadable<T = any> {
	read(i: number): T
}

export type IParseable<T = any> = IReadable<T> & ISizeable & ICopiable

export interface IBufferized<T = any> {
	readonly buffer: IPersistentAccumulator<T>
}

export interface IPushable<T = any> {
	push: (...x: T[]) => this
}

export interface IWritable<T = any> {
	write: (i: number, value: T) => this
}

export interface IStateSettable {
	setState(state: Summat): void
}

export interface IClearable {
	clear(): void
}

export interface IResource {
	cleanup(): void
}

export interface IIsOpen {
	readonly isOpen: boolean
}

export type IFiniteWritable<T = any> = ISizeable & IWritable<T>

export interface IRecursiveListIdentifiable {
	readonly isRecursiveInitList?: boolean
}

export interface ISwitchIdentifiable {
	readonly isSwitch?: boolean
}

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
export type * from "./interfaces/MapClass.js"
export type * from "./interfaces/Initializer.js"
export type * from "./interfaces/Node.js"
export type * from "./interfaces/PoolGetter.js"
export type * from "./interfaces/Position.js"
export type * from "./interfaces/Source.js"
export type * from "./interfaces/Stream.js"
export type * from "./interfaces/StreamHandler.js"
export type * from "./interfaces/TableMap.js"
