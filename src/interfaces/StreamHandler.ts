import type { IIndexable } from "../interfaces.js"
import type { IStream } from "./Stream.js"

/**
 * This is an interface intended to be used
 * for the "tabular" parser, consisting of
 * multiple different processing functions,
 * "glued" together by an `IIndexable` data structure.
 */
export type ITableMap<In = any, Out = any> = (
	x?: In,
	...y: any[]
) => Out & { readonly table: IIndexable<IParserFunction<In, Out>> }

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
	parser?: ITableMap<In, Out>,
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
