import { object, type as _type } from "@hgargg-0710/one"
import type { ITypeCheckable, ITyped } from "../interfaces.js"

const { prop } = object

/**
 * Returns the value of the `x.type` for the given `ITyped`
 */
export const type = prop("type") as <Type = any>(x: ITyped<Type>) => Type

/**
 * Returns the value of the `.is` property for the given `TypeCheckable`
 */
export const is = prop("is") as <Type = any>(
	t: ITypeCheckable
) => _type.TypePredicate<Type>
