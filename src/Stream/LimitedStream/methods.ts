import type { IDirectionalPosition, IPosed } from "../Position/interfaces.js"
import type { ILimitedStream, ILimitedUnderStream } from "./interfaces.js"

import {
	directionCompare,
	positionEqual,
	positionNegate
} from "../Position/utils.js"

import { Stream } from "../../constants.js"
const { LimitedStream } = Stream

import { navigate, rewind } from "../utils.js"

import { type } from "@hgargg-0710/one"
import type { IFreezableBuffer } from "../../interfaces.js"
const { isNullary } = type

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
		from?: IDirectionalPosition,
		to?: IDirectionalPosition,
		buffer?: IFreezableBuffer<Type>
	) {
		if (value || this.value) {
			if (value) this.super.init.call(this, value, buffer)

			this.hasLookAhead = false

			if (!isNullary(from)) {
				if (isNullary(to)) {
					to = from
					from = LimitedStream.NoMovementPredicate
				}

				rewind(this.value!)
				navigate(this.value!, from)

				this.direction = directionCompare(from, to)
				this.from = from
				this.to = positionNegate(to)
			}
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
