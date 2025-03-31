import type { IStreamParser } from "./interfaces.js"
import type { IEndableStream } from "../interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"

import { isBufferized } from "../../Collection/Buffer/utils.js"

import { Stream } from "../../constants.js"
import type { IFreezableBuffer } from "../../interfaces.js"
const { SkippedItem } = Stream.StreamParser

export namespace methods {
	export function baseNextIter<InType = any, OutType = any>(
		this: IStreamParser<InType, OutType>
	) {
		let currRes: OutType
		do currRes = this.handler(this.value)
		while (currRes === SkippedItem)
		return currRes
	}

	export function init<InType = any, OutType = any>(
		this: IStreamParser<InType, OutType>,
		input?: IEndableStream<InType>,
		buffer?: IFreezableBuffer<OutType>,
		state?: Summat
	) {
		if (input) {
			if (isBufferized(this))
				this.super.init.call(this, input, buffer, state)
			else this.super.init.call(this, input, state)
		}
		return this
	}

	export const initGetter = baseNextIter
}
