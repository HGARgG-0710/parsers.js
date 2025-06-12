import { type as _type, object } from "@hgargg-0710/one"
import type { ITypeCheckable, ITyped } from "../interfaces.js"

const { prop } = object

/**
 * Returns the value of the `x.type` for the given `ITyped`
 */
export const type = prop("type") as <T = any>(x: ITyped<T>) => T

/**
 * Returns the value of the `.is` property for the given `ITypeCheckable`
 */
export const is = prop("is") as <T = any>(
	t: ITypeCheckable
) => _type.TypePredicate<T>
