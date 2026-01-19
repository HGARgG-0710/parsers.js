import type { CustomLinkedStream } from "./CustomLinkedStream.js"

export declare abstract class CurrDyssyncLinkedStream<
	T = any
> extends CustomLinkedStream<T> {
	protected resetCurr(): void
	protected set curr(newCurr: T)
	get curr(): T
	postFree(): void
}
