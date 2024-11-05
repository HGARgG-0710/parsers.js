import { InputStream as InputStreamConstructor } from "./classes.js"

import { array } from "../../Parser/utils.js"
import type { BasicStream } from "../interfaces.js"
import type { InputStream } from "./interfaces.js"

/**
 * Given a `BasicStream`, converts it to an `InputStream` for the price of a single iteration.
 */
export function toInputStream<Type = any>(
	stream: BasicStream<Type>
): InputStream<Type> {
	return new InputStreamConstructor(array(stream).value)
}
