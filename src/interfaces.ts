import type { Summat } from "@hgargg-0710/summat.ts"
import type { Hash } from "./IndexMap/HashMap/interfaces.js"

export type Mappable<Type = any, Out = any> = (value: Type, index?: number) => Out

export interface Copiable<Type = any> {
	copy: () => Type
}

export interface Having {
	has: (x: any) => boolean
}

export interface Testable {
	test: (x: any) => boolean
}

export type IndexingFunction<KeyType = any> = (curr: KeyType, x: any) => boolean

export interface Sizeable {
	size: number
}

export interface Defaulting<Type = any> {
	default: Type
}

export interface IndexAssignable<Type = any> {
	assignedIndex?: Type
}

export interface Settable<KeyType = any, ValueType = any> {
	set: (key: KeyType, value: ValueType) => this
}

export interface Deletable<KeyType = any> {
	delete: (key: KeyType) => this
}

export interface Rekeyable<KeyType = any> {
	rekey: (keyFrom: KeyType, keyTo: KeyType) => this
}

export interface Hashable<KeyType, InternalKeyType> {
	hash: Hash<KeyType, InternalKeyType>
}

export type Indexed<Type = any> =
	| string
	| ({
			[x: number]: Type
			length: number
	  } & Iterable<Type>)

export interface Supered {
	super: Summat
}

export type * from "./Collection/interfaces.js"
export type * from "./EnumSpace/interfaces.js"
export type * from "./IndexMap/interfaces.js"
export type * from "./Parser/interfaces.js"

export type * from "./Pattern/interfaces.js"
export type * from "./Position/interfaces.js"
export type * from "./Stream/interfaces.js"

export type * from "./Token/interfaces.js"
export type * from "./Tree/interfaces.js"
