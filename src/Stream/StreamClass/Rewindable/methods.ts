import type { BasicReversibleStream } from "../../ReversibleStream/interfaces.js"
import { uniRewind } from "./utils.js"

export function rewind<Type = any>(this: BasicReversibleStream<Type>) {
	return uniRewind(this)
}
