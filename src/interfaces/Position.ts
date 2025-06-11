/**
 * An interface representing some form of a position inside a
 * sequence of unknown nature. It can be dynamic (set through a predicate),
 * or finite, and be given through a `number`. `IPosition`s have a purposefully
 * ambigious interpretation, so that the user can employ them to their own needs.
 *
 * Most typically, they are useful whenever there is a loop through
 * a data structure, and a need to "stop" at a certain moment, that
 * may (or may not) be known in advance. For such general cases,
 * `IPosition` is a perfect fit.
 */
export type IPosition<Type = any> = IPredicatePosition<Type> | number

/**
 * An `IPosition` representing an "unknown" halting point.
 * It is determined by the result of the predicate. The
 * `true/false` that are returned can be interpreted either way.
 */
export type IPredicatePosition<In = any> = (
	item: In,
	pos?: IPosition
) => boolean

/**
 * The interface for objects with a `readonly .pos: T`.
 */
export interface IPosed<T = any> {
	readonly pos: T
}

export type * from "../modules/Position/interfaces/LineIndex.js"
