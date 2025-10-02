import type { IIndexable } from "../interfaces.js"
import type {
	IParserFunction,
	ITableHandler,
	IWrapHandler
} from "../interfaces/StreamHandler.js"

/**
 * This is a function for the creation of functions `T` which:
 *
 * 1. Accept `x?: In, ...y: any[]` arguments
 * 2. Calls, and saves the `const M = indexMap.index(x, ...y)`
 * 3. Returns the result as `return M.call(this, x, T, ...y)` [note: preserves the `this` context]
 *
 * The function is particularly good in combination with various
 * kinds of `IIndexable`s provided by the library and the `IStream`s
 * that rely upon user-constructed handlers. Any time that a user
 * encounters a branch that must rely upon an underlying `IIndexable`,
 * they can employ this function.
 */
export function TableHandler<In = any, Out = any>(
	indexable: IIndexable<IParserFunction<In, Out>>
): ITableHandler<In, Out> {
	const T = function (x?: In, ...y: any[]) {
		return T.table.index(x, ...y).call(this, x, T, ...y)
	}
	T.table = indexable
	return T
}

/**
 * This is a function for creation of functions `T` which:
 *
 * 1. Accepts `x: any, ...y: any[]` arguments
 * 2. Returns the result of `indexMap.index(x, ...y)`
 *
 * Purpose of this is to create a more generalized version of
 * the `TableMap`, since, on occasions, one may want more complex
 * (and not necesserily always dynamic) output to be employed.
 */
export function WrapHandler<Out = any>(
	indexable: IIndexable<Out>
): IWrapHandler<Out> {
	const T = (x: any, ...y: any[]) => T.table.index(x, ...y)
	T.table = indexable
	return T
}
