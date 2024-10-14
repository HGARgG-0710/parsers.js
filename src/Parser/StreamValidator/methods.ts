import type { BasicStream } from "../../Stream/interfaces.js"
import type { StreamPredicate } from "../TableMap/interfaces.js"
import type { StreamValidatorState } from "./interfaces.js"

export function streamValidatorFinished<KeyType = any>(
	this: StreamValidatorState<KeyType>
) {
	return !this.result || (this.streams as BasicStream<KeyType>[])[0].isEnd
}

export function streamValidatorChange<KeyType = any>(
	this: StreamValidatorState<KeyType>,
	next: StreamPredicate
) {
	if ((this.result = next && next((this.streams as BasicStream<KeyType>[])[0])))
		(this.streams as BasicStream<KeyType>[])[0].next()
}
