import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "./BasicStream.js"
import type { PreBasicStream } from "./PreBasicStream.js"
import type { StreamIterable } from "./StreamIterable.js"

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

export function StreamCurrGetter<Type = any>(
	stream: StreamIterable<Type>,
	getter: () => Type,
	returnSetCurrentCondition: () => boolean = () => false
): PreBasicStream<Type> {
	return Object.defineProperties(stream, {
		realCurr: {
			writable: true,
			value: null
		},
		curr: {
			set: function (value) {
				return (this.realCurr = value)
			},
			get: function () {
				return returnSetCurrentCondition.call(this)
					? this.realCurr
					: getter.call(this)
			}
		}
	}) as PreBasicStream<Type>
}
