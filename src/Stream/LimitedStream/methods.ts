import type { IFreezableBuffer } from "../../interfaces.js"
import type { ILimitedUnderStream } from "./interfaces.js"
import type { ILimitedStreamImpl } from "./refactor.js"

import { positionEqual } from "../Position/utils.js"
import { navigate, rewind } from "../utils.js"

export namespace methods {
	export function baseNextIter<Type = any>(this: ILimitedStreamImpl<Type>) {
		this.hasLookAhead = false
		return this.lookAhead
	}

	export function prod<Type = any>(this: ILimitedStreamImpl<Type>) {
		const { value, direction, hasLookAhead, lookAhead } = this
		if (!hasLookAhead) {
			this.hasLookAhead = true
			value![direction ? "next" : "prev"]()
			return value!.curr
		}
		return lookAhead
	}

	export function isCurrEnd<Type = any>(this: ILimitedStreamImpl<Type>) {
		const { value, to } = this
		if (value!.isCurrEnd()) return true
		this.lookAhead = this.prod()
		return positionEqual(value!, to)
	}

	export function isCurrStart<Type = any>(this: ILimitedStreamImpl<Type>) {
		const { value, from } = this
		return positionEqual(value!, from)
	}

	export function basePrevIter<Type = any>(this: ILimitedStreamImpl<Type>) {
		const { curr, direction, value } = this
		this.lookAhead = curr
		this.hasLookAhead = true
		value![direction ? "prev" : "next"]()
		return value!.curr
	}

	export function init<Type = any>(
		this: ILimitedStreamImpl<Type>,
		value?: ILimitedUnderStream<Type>,
		buffer?: IFreezableBuffer<Type>
	) {
		if (value || this.value) {
			if (value) this.super.init.call(this, value, buffer)
			this.hasLookAhead = false
			rewind(this.value!)
			navigate(this.value!, this.from)
		}
		return this
	}

	export function copy<Type = any>(
		this: ILimitedStreamImpl<Type>
	): ILimitedStreamImpl<Type> {
		return new this.constructor(
			this.value?.copy(),
			this.from,
			this.to,
			this.buffer
		)
	}
}
