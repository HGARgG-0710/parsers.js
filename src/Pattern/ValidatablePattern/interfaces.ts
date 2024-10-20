import type { Summat, SummatFunction } from "@hgargg-0710/summat.ts"
import type { Pattern, Flushable, Resulting } from "../interfaces.js"

export type ValidationOutput<Type = any> =
	| [true, Type[]]
	| [false, (Type | true | [false, Type])[]]

export type InvalidEntries<Type = any> = [number, Type][]

export interface Validatable<Type = any, KeyType = any> extends Summat {
	validate: (
		key: KeyType,
		handler: SummatFunction<any, Type, boolean>
	) => ValidationOutput<Type>
}

export interface ValidatablePattern<Type = any, KeyType = any>
	extends Pattern<Type>,
		Resulting<ValidationOutput<Type>>,
		Flushable,
		Validatable<Type, KeyType> {}

export type ValidatableStringPattern = ValidatablePattern<string, RegExp | string>
