import type { Summat } from "@hgargg-0710/summat.ts"
import type { IHash } from "./HashMap/interfaces.js"
import type { IPosition } from "./interfaces.js"
import type { IPersistentAccumulator } from "./interfaces/Accumulator.js"

export type IMappable<Type = any, Out = any> = (
	value: Type,
	index?: number
) => Out

export interface ICopiable {
	copy: () => this
}

export interface IHaving {
	has: (x: any) => boolean
}

export interface ITestable {
	test: (x: any) => boolean
}

export type IIndexingFunction<KeyType = any> = (
	curr: KeyType,
	x: any
) => boolean

export interface ISizeable {
	size: number
}

export interface IDefaulting<Type = any> {
	readonly default: Type
}

export interface IIndexAssignable<Type = any> {
	assignedIndex?: Type
}

export interface ISettable<KeyType = any, ValueType = any> {
	set: (key: KeyType, value: ValueType) => this
}

export interface IDeletable<KeyType = any> {
	delete: (key: KeyType) => this
}

export interface IRekeyable<KeyType = any> {
	rekey: (fromKey: KeyType, toKey: KeyType) => this
}

export interface IHashable<KeyType, InternalKeyType> {
	hash: IHash<KeyType, InternalKeyType>
}

export type IIndexed<Type = any> =
	| {
			[x: number]: Type
			length: number
	  } & Iterable<Type>

export type IInvalidEntries<Type = any> = [IPosition, Type][]

export type IValidationResult = true | [false, IPosition]

export interface IStateful<Type extends Summat = Summat> {
	readonly state: Type
}

export interface IGettable<Type = any> {
	get: () => Type
}

export interface IInitializable {
	init: (...x: any[]) => this
}

export interface IPointer<Type = any> {
	value: Type
}

export interface IReversible {
	reverse: () => this
}

export interface IIndexable<ValueType = any> {
	index: (x: any, ...y: any[]) => ValueType
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

export interface IReadable<Type = any> {
	read(i: number): Type
}

export type IParseable<Type = any> = IReadable<Type> & ISizeable & ICopiable

export interface IBufferized<Type = any> {
	buffer: IPersistentAccumulator<Type>
}

export interface IPushable<Type = any> {
	push: (...x: Type[]) => this
}

export interface IWritable<Type = any> {
	write: (i: number, value: Type) => this
}

export type * from "./DynamicParser/interfaces.js"
export type * from "./HashMap/interfaces.js"
export type * from "./IndexMap/interfaces.js"
export type * from "./LookupTable/interfaces.js"
export type * from "./Node/interfaces.js"
export type * from "./Source/interfaces.js"
export type * from "./Stream/interfaces.js"
export type * from "./TableMap/interfaces.js"

export type * from "./interfaces/Accumulator.js"
export type * from "./interfaces/ArrayCollection.js"
export type * from "./interfaces/Sequence.js"
