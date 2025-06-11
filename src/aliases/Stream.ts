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
 * Given a `BasicStream` returns its `.curr` property value
 */
export const curr = prop("curr") as <T = any>(x: IStream<T>) => T

/**
 * Returns the value of `.isEnd` property of the given `BasicStream`
 */
export const isEnd = prop("isEnd") as <T = any>(x: IStream<T>) => boolean

/**
 * Returns the value of the `.isStart` property of the given `BasicStream`
 */
export const isStart = prop("isStart") as <T = any>(x: IStream<T>) => boolean

/**
 * Returns the `.buffer` property of the given `Bufferized`
 */
export const buffer = prop("buffer") as <T = any>(
	x: IBufferized<T>
) => IPersistentAccumulator<T>

/**
 * Returns the `.pos` property of the given `Posed` object
 */
export const pos = prop("pos") as <T = any>(x: IPosed<T>) => T

export const state = prop("state") as (x: IStateful) => Summat

export const resource = prop("resource") as (
	x: IResourcefulStream
) => IOwnedStream
