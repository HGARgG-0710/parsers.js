import type { SummatFunction } from "./../Summat.js"
import type { BasicStream } from "./BasicStream.js"
import type { PreBasicStream } from "./PreBasicStream.js"

export function setMet(name: MetType) {
	return function (value: boolean) {
		this[name] = value
	}
}

export function getIsBoundry(subName: MetType) {
	return function (getter: SummatFunction<PreBasicStream>) {
		return function (this: PreBasicStream) {
			const basicEnd = getter.call(this)
			const retval = basicEnd && this[subName]
			this[subName] = basicEnd
			return retval
		}
	}
}

export type MetType = "metStart" | "metEnd"
export type BoundType = "isStart" | "isEnd"

export function StreamBoundHandler(name: BoundType, subName: MetType) {
	const metSetter = setMet(subName)
	const boundryCheck = getIsBoundry(subName)
	const initMet = name === "isStart"

	return function (
		prestream: PreBasicStream,
		getter: SummatFunction<PreBasicStream>
	): BasicStream {
		return Object.defineProperties(prestream, {
			[name]: {
				set: metSetter,
				get: boundryCheck(getter)
			},
			[subName]: {
				writable: true,
				value: initMet
			}
		}) as BasicStream
	}
}

export const StreamEndingHandler = StreamBoundHandler("isEnd", "metEnd")
export const StreamStartHandler = StreamBoundHandler("isStart", "metStart")
