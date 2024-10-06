import type { BasicStream } from "src/Stream/interfaces.js"
import type { StreamPredicate } from "../ParserMap/interfaces.js"
import type { StreamValidatorState } from "./interfaces.js"

export function streamValidatorFinished<KeyType = any>(
	this: StreamValidatorState<KeyType>
) {
	return (this.streams as BasicStream<KeyType>[])[0].isEnd || !this.result
}

export function streamValidatorChange<KeyType = any>(
	this: StreamValidatorState<KeyType>,
	next: StreamPredicate
) {
	if ((this.result = next && next((this.streams as BasicStream<KeyType>[])[0])))
		(this.streams as BasicStream<KeyType>[])[0].next()
}
