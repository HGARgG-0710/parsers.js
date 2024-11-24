import type { Summat, SummatFunction } from "@hgargg-0710/summat.ts"
import type { Pattern, Flushable, Resulting } from "../Pattern/interfaces.js"
import type { Pair, Pairs } from "../IndexMap/interfaces.js"

export type InvalidMatch = false
export type ValidMatch = true
export type FaultyElement<Type = any> = Pair<InvalidMatch, Type>

export type ValidationOutput<Type = any> =
	| [true, Type[]]
	| [false, (Type | ValidMatch | FaultyElement<Type>)[]]

export type InvalidEntries<Type = any> = Pairs<number, Type>

export type ValidationHandler<Type = any> = SummatFunction<
	any,
	Type,
	ValidMatch | InvalidMatch
>

export type MethodValidator<Type = any, KeyType = any> = (
	key: KeyType,
	handler: ValidationHandler<Type>
) => ValidationOutput<Type>

export type FreeValidator<Type = any, KeyType = any> = (
	value: Type,
	key: KeyType,
	handler: ValidationHandler<Type>
) => ValidationOutput<Type>

export interface Validatable<Type = any, KeyType = any> extends Summat {
	validate: MethodValidator<Type, KeyType>
}

export interface ValidatablePattern<Type = any, KeyType = any>
	extends Pattern<Type>,
		Resulting<ValidationOutput<Type>>,
		Flushable,
		Validatable<Type, KeyType> {}

export interface DelegateValidatablePattern<Type = any, KeyType = any>
	extends ValidatablePattern<Type, KeyType> {
	validator: FreeValidator<Type, KeyType>
}

export type ValidatableStringPattern = ValidatablePattern<string, RegExp | string>
