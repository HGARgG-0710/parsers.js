import type { BasicStream } from "../../BasicStream/interfaces.js"
import { uniFinish } from "./utils.js"

export function finish<Type = any>(this: BasicStream<Type>) {
	return uniFinish(this)
}
