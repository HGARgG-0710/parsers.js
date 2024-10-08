import type { BasicStream } from "../../interfaces.js"
import { uniFinish } from "./utils.js"

export function finish<Type = any>(this: BasicStream<Type>) {
	return uniFinish(this)
}
