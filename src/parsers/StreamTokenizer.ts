import { isFunction } from "../misc.js"
import type { BasicStream } from "src/types/Stream/BasicStream.js"
import type { StreamMap } from "./ParserMap.js"
import { StreamEndingHandler } from "../types/Stream/StreamEndingHandler.js"

export interface StreamTokenizer<OutType = any> extends BasicStream<OutType> {}

export function StreamTokenizerIsEnd() {
	return !this.curr()
}

export function StreamTokenizer<OutType = any>(tokenMap: StreamMap<OutType>) {
	return function (input: BasicStream): StreamTokenizer<OutType> {
		return StreamEndingHandler(
			{
				current: null,
				next: function () {
					const prev = this.current || this.curr()
					this.current = ((x) => (isFunction(x) ? x.call(this, input) : x))(
						tokenMap(input)
					)
					input.next()
					return prev as OutType
				},
				curr: function () {
					if (this.isStart) {
						this.isStart = false
						this.next()
					}
					return this.current as OutType
				},
				isStart: true
			},
			StreamTokenizerIsEnd
		)
	}
}
