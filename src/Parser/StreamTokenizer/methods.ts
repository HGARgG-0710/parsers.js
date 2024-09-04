import type { StartedStream } from "main.js"


export function streamTokenizerCurrentCondition<Type = any>(this: StartedStream<Type>) {
	return !this.isStart
}
