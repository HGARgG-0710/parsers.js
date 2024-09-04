import type { StreamHandler } from "../ParserMap/interfaces.js"
import type { StreamValidatorState } from "./interfaces.js"

export function streamValidatorFinished<KeyType = any>(
	this: StreamValidatorState<KeyType>
) {
	return this.streams[0].isEnd || !this.result
}

export function streamValidatorChange<KeyType = any>(
	this: StreamValidatorState<KeyType>,
	next: StreamHandler<boolean>
) {
	this.result = next && next(this.streams[0])
	if (this.result) this.streams[0].next()
}
