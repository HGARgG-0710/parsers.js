import type { Summat } from "@hgargg-0710/summat.ts"
import type { IHash } from "./HashMap/interfaces.js"
import type { IThisMethod } from "./refactor.js"

export type IMappable<Type = any, Out = any> = (
	value: Type,
	index?: number
) => Out

export interface ICopiable {
	copy: () => typeof this
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
	set: IThisMethod<[KeyType, ValueType], this>
}

export interface IDeletable<KeyType = any> {
	delete: IThisMethod<[KeyType], this>
}

export interface IRekeyable<KeyType = any> {
	rekey: IThisMethod<[KeyType, KeyType], this>
}

export interface IHashable<KeyType, InternalKeyType> {
	hash: IHash<KeyType, InternalKeyType>
}

export type IIndexed<Type = any> =
	| {
			[x: number]: Type
			length: number
	  } & Iterable<Type>

export interface ISupered {
	readonly super: Summat
}

export type IInvalidEntries<Type = any> = [number, Type][]

export type IValidationResult = true | [false, number]

export interface IStateful<Type extends Summat = Summat> {
	readonly state: Type
}

export interface IGettable<Type = any> {
	get: () => Type
}

export interface IInitializable<ArgType extends any[] = any[], OutType = any> {
	init: IThisMethod<ArgType, OutType>
}

export interface IPointer<Type = any> {
	value: Type
}

export type IPattern<Type = any> = Partial<IPointer<Type>>

export interface IReversible {
	reverse: () => this
}

export type IRecursivePointer<T = any> = IPointer<T | IRecursivePointer<T>>

export interface IIndexable<ValueType = any> {
	index: (x: any, ...y: any[]) => ValueType
}

export type * from "./Collection/interfaces.js"
export type * from "./Composition/interfaces.js"
export type * from "./EnumSpace/interfaces.js"
export type * from "./HashMap/interfaces.js"
export type * from "./IndexMap/interfaces.js"
export type * from "./LookupTable/interfaces.js"
export type * from "./Node/interfaces.js"
export type * from "./Stream/interfaces.js"
export type * from "./TableMap/interfaces.js"
