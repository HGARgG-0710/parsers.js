import { array } from "src/Parser/utils.js"
import type { BasicStream } from "../BasicStream/interfaces.js"
import { InputStream as InputStreamConstructor } from "./classes.js"
import type { InputStream } from "./interfaces.js"

export function toInputStream<Type = any>(stream: BasicStream<Type>): InputStream<Type> {
	return InputStreamConstructor(array(stream).value)
}
