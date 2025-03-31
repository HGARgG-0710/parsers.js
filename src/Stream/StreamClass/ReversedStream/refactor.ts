import type { IReversedStream } from "./interfaces.js"
import type { IReversibleStream } from "src/Stream/interfaces.js"

import { finish } from "src/Stream/utils.js"

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
