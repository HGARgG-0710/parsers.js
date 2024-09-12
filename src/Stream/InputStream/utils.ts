import { array } from "src/Parser/utils.js"
import type { BasicStream } from "../BasicStream/interfaces.js"
import { InputStream as InputStreamConstructor } from "./classes.js"
import type { InputStream } from "./interfaces.js"

/**
 * Given a `BasicStream`, converts it to an `InputStream` for the price of a single iteration.
*/
export function toInputStream<Type = any>(stream: BasicStream<Type>): InputStream<Type> {
	return InputStreamConstructor(array(stream).value)
}
