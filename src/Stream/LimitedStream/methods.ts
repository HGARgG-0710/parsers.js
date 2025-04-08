import type { IDirectionalPosition, IPosed } from "../Position/interfaces.js"
import type { IFreezableBuffer } from "../../interfaces.js"
import type { ILimitedStream, ILimitedUnderStream } from "./interfaces.js"

import { positionEqual } from "../Position/utils.js"
import { navigate, rewind } from "../utils.js"

export namespace methods {
	export function baseNextIter<Type = any>(this: ILimitedStream<Type>) {
		this.hasLookAhead = false
		return this.lookAhead
	}

	export function prod<Type = any>(this: ILimitedStream<Type>) {
		const { value, direction, hasLookAhead, lookAhead } = this
		if (!hasLookAhead) {
			this.hasLookAhead = true
			value![direction ? "next" : "prev"]()
			return value!.curr
		}
		return lookAhead
	}

	export function isCurrEnd<Type = any>(this: ILimitedStream<Type>) {
		const { value, to } = this
		if (value!.isCurrEnd()) return true
		this.lookAhead = this.prod()
		return positionEqual(
			value! as ILimitedUnderStream<Type> & IPosed<IDirectionalPosition>,
			to
		)
	}

	export function isCurrStart<Type = any>(this: ILimitedStream<Type>) {
		const { value, from } = this
		return (
			value!.isCurrStart() ||
			positionEqual(
				value! as ILimitedUnderStream<Type> &
					IPosed<IDirectionalPosition>,
				from
			)
		)
	}

	export function basePrevIter<Type = any>(this: ILimitedStream<Type>) {
		const { curr, direction, value } = this
		this.lookAhead = curr
		this.hasLookAhead = true
		value![direction ? "prev" : "next"]()
		return value!.curr
	}

	export function init<Type = any>(
		this: ILimitedStream<Type>,
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
		this: ILimitedStream<Type>
	): ILimitedStream<Type> {
		return new this.constructor(
			this.value!.copy(),
			this.from,
			this.to,
			this.buffer
		)
	}
}
