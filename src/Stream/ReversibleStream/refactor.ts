import type { ReversibleStream, IReversedStream } from "./interfaces.js"

import { finish } from "../StreamClass/utils.js"
import { superInit } from "../StreamClass/refactor.js"

export namespace methods {
	export function init<Type = any>(
		this: IReversedStream<Type>,
		value?: ReversibleStream<Type>
	): IReversedStream<Type> {
		if (value) {
			finish(value)
			superInit(this, value)
		}
		return this
	}
}
