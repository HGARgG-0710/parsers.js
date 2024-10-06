import { InputStream as InputStreamConstructor } from "./classes.js"

import { array } from "src/Parser/utils.js"
import type { BasicStream } from "../interfaces.js"
import type { EffectiveInputStream } from "./interfaces.js"

/**
 * Given a `BasicStream`, converts it to an `InputStream` for the price of a single iteration.
 */
export function toInputStream<Type = any>(
	stream: BasicStream<Type>
): EffectiveInputStream<Type> {
	return new InputStreamConstructor(array(stream).value)
}
