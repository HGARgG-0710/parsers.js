import { underStreamCurr } from "./UnderStream.js"
import { underStreamNext } from "./UnderStream.js"
import { underStreamPrev } from "./UnderStream.js"
import type { BasicStream } from "./BasicStream.js"

export function ReversedStream<Type = any>(
	input: ReversibleStream<Type>
): ReversibleStream<Type> {
	while (!input.isEnd) input.next()
	return Object.defineProperties(
		{
			input,
			next: underStreamPrev,
			prev: underStreamNext,
			curr: underStreamCurr
		},
		{
			isEnd: {
				get: function () {
					return this.input.isStart
				}
			},
			isStart: {
				get: function () {
					return this.input.isEnd
				}
			}
		}
	) as unknown as ReversibleStream<Type>
}
export interface ReversibleStream<Type = any> extends BasicStream<Type> {
	prev(this: ReversibleStream<Type>): Type
	isStart: boolean
}
