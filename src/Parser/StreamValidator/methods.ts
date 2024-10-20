import type { StreamPredicate } from "../TableMap/interfaces.js"
import type { StreamValidatorState } from "./interfaces.js"

export function streamValidatorFinished<KeyType = any>(
	this: StreamValidatorState<KeyType>
) {
	return !this.result || this.streams![0].isEnd
}

export function streamValidatorChange<KeyType = any>(
	this: StreamValidatorState<KeyType>,
	next: StreamPredicate
) {
	if ((this.result = next && next(this.streams![0]))) this.streams![0].next()
}
