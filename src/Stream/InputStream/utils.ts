import { function as _f } from "@hgargg-0710/one"
const { and } = _f

import type { InputStream } from "./interfaces.js"
import { InputStream as InputStreamConstructor } from "./classes.js"

import { array } from "src/Parser/utils.js"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { EffectiveInputStream } from "./interfaces.js"
import { isPositionalStream } from "../PositionalStream/utils.js"
import { isInputted } from "../UnderStream/utils.js"
import { isIterable } from "../StreamClass/Iterable/utils.js"

/**
 * Given a `BasicStream`, converts it to an `InputStream` for the price of a single iteration.
 */
export function toInputStream<Type = any>(
	stream: BasicStream<Type>
): EffectiveInputStream<Type> {
	return new InputStreamConstructor(array(stream).value)
}

export const isInputStream = and(isInputted, isIterable, isPositionalStream) as (
	x: any
) => x is InputStream
