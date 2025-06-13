import type { IIndexable } from "../interfaces.js"
import type { IStream } from "./Stream.js"

/**
 * This is an interface intended to be used
 * for the "tabular" parser, consisting of
 * multiple different processing functions,
 * "glued" together by an `IIndexable` data structure.
 */
export type ITableHandler<In = any, Out = any> = (
	x?: In,
	...y: any[]
) => Out & { readonly table: IIndexable<IParserFunction<In, Out>> }

/**
 * This is an interface, which serves as a generalization of `ITableHandler`.
 * Unlike `ITableHandler`, it can contain anything, and, hence, makes no
 * assumption about the possibility of a call to the value obtained via
 * the `.index(...)` call. It, thus, is simply a wrapper for the underlying
 * `readonly table` property.
 */
export type IWrapHandler<Out = any> = ((x?: any, ...y: any[]) => Out) & {
	readonly table: IIndexable<Out>
}

/**
 * This is an interface for representing a function that is an internal part
 * of a `TableMap`. It accepts an `In` type, and produces an `Out`.
 * The `parser?: ITableMap<In, Out>` is the "owning" function, the purpose of
 * which is to provide access to the "`IParserFunction`-gluing" `IIndexable`
 * data-structure, which may (sometimes) be alterable, or need to be used
 * internally.
 */
export type IParserFunction<In = any, Out = any> = (
	input?: In,
	parser?: ITableHandler<In, Out>,
	...x: any[]
) => Out

/**
 * This is a function for representing a transformation of a given
 * `IStream`, with `i?: number` serving as a current index of the
 * transformed element.
 */
export type IStreamTransform<UnderType = any, UpperType = any> = (
	input?: IStream<UnderType>,
	i?: number
) => UpperType
