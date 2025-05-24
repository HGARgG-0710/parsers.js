import { object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	IBufferized,
	IPersistentAccumulator,
	IPosed,
	IStateful,
	IStream
} from "../interfaces.js"

const { prop } = object

/**
 * Given a `BasicStream` returns its `.curr` property value
 */
export const curr = prop("curr") as <Type = any>(x: IStream<Type>) => Type

/**
 * Returns the value of `.isEnd` property of the given `BasicStream`
 */
export const isEnd = prop("isEnd") as <Type = any>(x: IStream<Type>) => boolean

/**
 * Returns the value of the `.isStart` property of the given `BasicStream`
 */
export const isStart = prop("isStart") as <Type = any>(
	x: IStream<Type>
) => boolean

/**
 * Returns the `.buffer` property of the given `Bufferized`
 */
export const buffer = prop("buffer") as <Type = any>(
	x: IBufferized<Type>
) => IPersistentAccumulator<Type>

/**
 * Returns the `.pos` property of the given `Posed` object
 */
export const pos = prop("pos") as <Type = any>(x: IPosed<Type>) => Type

export const state = prop("state") as (x: IStateful) => Summat

export const resource = prop("resource")
