import { object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	IBufferized,
	IOwnedStream,
	IPersistentAccumulator,
	IPosed,
	IResourcefulStream,
	IStateful,
	IStream
} from "../interfaces.js"

const { prop } = object

/**
 * Given an `IStream` returns its `.curr` property value
 */
export const curr = prop("curr") as <T = any>(x: IStream<T>) => T

/**
 * Returns the value of `.isEnd` property of the given `IStream`
 */
export const isEnd = prop("isEnd") as <T = any>(x: IStream<T>) => boolean

/**
 * Returns the value of the `.isStart` property of the given `IStream`
 */
export const isStart = prop("isStart") as <T = any>(x: IStream<T>) => boolean

/**
 * Returns the `.buffer` property of the given `IBufferized`
 */
export const buffer = prop("buffer") as <T = any>(
	x: IBufferized<T>
) => IPersistentAccumulator<T>

/**
 * Returns the `.pos` property of the given `IPosed` object
 */
export const pos = prop("pos") as <T = any>(x: IPosed<T>) => T

/**
 * Returns the `.state` property of the given `IStateful` object
 */
export const state = prop("state") as <T extends Summat = Summat>(
	x: IStateful<T>
) => T

/**
 * Returns the `.resource` property of the given `IResourcefulStream` object
*/
export const resource = prop("resource") as (
	x: IResourcefulStream
) => IOwnedStream
