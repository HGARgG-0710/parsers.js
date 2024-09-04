import type { StartedStream } from "src/Stream/ReversibleStream/interfaces.js"

export function streamTokenizerCurrentCondition<Type = any>(this: StartedStream<Type>) {
	return !this.isStart
}
