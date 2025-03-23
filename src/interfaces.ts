import type { Summat } from "@hgargg-0710/summat.ts"
import type { IHash } from "./IndexMap/HashMap/interfaces.js"

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
	set: (key: KeyType, value: ValueType) => this
}

export interface IDeletable<KeyType = any> {
	delete: (key: KeyType) => this
}

export interface IRekeyable<KeyType = any> {
	rekey: (keyFrom: KeyType, keyTo: KeyType) => this
}

export interface IHashable<KeyType, InternalKeyType> {
	hash: IHash<KeyType, InternalKeyType>
}

export type IIndexed<Type = any> =
	| string
	| ({
			[x: number]: Type
			length: number
	  } & Iterable<Type>)

export interface ISupered {
	readonly super: Summat
}

export type IInvalidEntries<Type = any> = [number, Type][]

export type IValidationResult = true | [false, number]

export type * from "./Collection/interfaces.js"
export type * from "./EnumSpace/interfaces.js"
export type * from "./IndexMap/interfaces.js"
export type * from "./Parser/interfaces.js"
export type * from "./Pattern/interfaces.js"
export type * from "./Position/interfaces.js"
export type * from "./Stream/interfaces.js"
