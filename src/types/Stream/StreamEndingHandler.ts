import type { SummatFunction } from "main.js"
import type { BasicStream, PreBasicStream } from "./BasicStream.js"

export function setMetEnd(value: boolean) {
	this.metEnd = value
}

export function getIsEnd(getter: SummatFunction<PreBasicStream>) {
	return function (this: PreBasicStream) {
		const basicEnd = getter.call(this)
		const retval = basicEnd && this.metEnd
		this.metEnd = basicEnd
		return retval
	}
}

export function StreamEndingHandler(
	prestream: PreBasicStream,
	getter: SummatFunction<PreBasicStream>
): BasicStream {
	return Object.defineProperties(prestream, {
		isEnd: {
			set: setMetEnd,
			get: getIsEnd(getter)
		},
		metEnd: {
			writable: true,
			value: false
		}
	}) as BasicStream
}
