import type { IStreamParser } from "./interfaces.js"
import type { IEndableStream } from "../StreamClass/interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { IStreamHandler } from "../../Parser/TableMap/interfaces.js"

import { superInit } from "../StreamClass/refactor.js"
import { isBufferized } from "../../Collection/Buffer/utils.js"

import { Stream } from "../../constants.js"
const { SkippedItem } = Stream.StreamParser

import { functional } from "@hgargg-0710/one"
const { copy } = functional

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
		handler?: IStreamHandler<OutType>,
		input?: IEndableStream<InType>,
		state?: Summat
	) {
		if (handler) this.handler = copy(handler, this) as IStreamHandler<OutType>
		if (input) {
			if (isBufferized(this)) superInit(this, input, null, state)
			else superInit(this, input, state)
		}
		return this
	}

	export const initGetter = baseNextIter
}
