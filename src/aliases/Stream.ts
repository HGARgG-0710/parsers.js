import { object } from "@hgargg-0710/one"
import type { IStream } from "../interfaces.js"

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
