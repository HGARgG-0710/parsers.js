import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type { StreamHandler } from "../ParserMap/interfaces.js"
import type { StreamValidatorState } from "./interfaces.js"

export function streamValidatorFinished<KeyType = any>(
	this: StreamValidatorState<KeyType>
) {
	return (this.streams as BasicStream<KeyType>[])[0].isEnd || !this.result
}

export function streamValidatorChange<KeyType = any>(
	this: StreamValidatorState<KeyType>,
	next: StreamHandler<boolean>
) {
	this.result = next && next((this.streams as BasicStream<KeyType>[])[0])
	if (this.result) (this.streams as BasicStream<KeyType>[])[0].next()
}
