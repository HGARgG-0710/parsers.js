import type { IReversibleStream, IReversedStream } from "./interfaces.js"

import { finish } from "../StreamClass/utils.js"

export namespace methods {
	export function init<Type = any>(
		this: IReversedStream<Type>,
		value?: IReversibleStream<Type>
	): IReversedStream<Type> {
		if (value) {
			finish(value)
			this.super.init.call(this, value)
		}
		return this
	}
}
