import type { Summat } from "@hgargg-0710/summat.ts"
import type { ISupered } from "../../refactor.js"

import type {
	IEndableStream,
	IStreamClassInstance,
	IStreamParser,
	IStreamParserConstructor,
	IStreamParserInitSignature
} from "../interfaces.js"

import type { IFreezableBuffer, IStreamTransform } from "../../interfaces.js"

import { isBufferized } from "../../Collection/Buffer/utils.js"

import { Stream } from "../../constants.js"
const { SkippedItem } = Stream.StreamParser

export namespace methods {
	export function baseNextIter<InType = any, OutType = any>(
		this: IStreamParserImpl<InType, OutType>
	) {
		let currRes: OutType
		do currRes = this.handler(this.value)
		while (currRes === SkippedItem)
		return currRes
	}

	export function init<InType = any, OutType = any>(
		this: IStreamParserImpl<InType, OutType>,
		value?: IEndableStream<InType>,
		buffer?: IFreezableBuffer<OutType>,
		state?: Summat
	) {
		if (value) {
			if (isBufferized(this))
				this.super.init.call(this, value, buffer, state)
			else this.super.init.call(this, value, state)
		}
		return this
	}

	export const initGetter = baseNextIter
}

export type IStreamParserImpl<InType = any, OutType = any> = IStreamParser<
	InType,
	OutType
> &
	IStreamClassInstance<
		OutType,
		IEndableStream<InType>,
		number,
		IStreamParserInitSignature<InType, OutType>
	> &
	ISupered & {
		["constructor"]: IStreamParserConstructor<InType, OutType>
		handler: IStreamTransform<InType, OutType>
	}
