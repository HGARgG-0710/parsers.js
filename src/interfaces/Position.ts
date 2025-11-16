export type IStep<T = any> = number | IStepPredicate<T>

export type IStepPredicate<In = any> = (
	item: In,
	pos?: number
) => boolean | number

/**
 * The interface for objects with a `readonly .pos: number`.
 */
export interface IPosed {
	readonly pos: number
}

export type * from "../modules/Position/interfaces/LineIndex.js"
