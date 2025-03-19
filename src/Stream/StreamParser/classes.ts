import type { Summat } from "@hgargg-0710/summat.ts"
import type { IFreezableBuffer } from "../../Collection/Buffer/interfaces.js"

import type {
	IEndableStream,
	IStreamClassInstance
} from "../../Stream/StreamClass/interfaces.js"

import type { AbstractConstructor, Constructor } from "../StreamClass/refactor.js"
import type { IStreamHandler } from "../../Parser/TableMap/interfaces.js"
import type { IPattern } from "../../Pattern/interfaces.js"
import type { IStreamParser } from "./interfaces.js"

import { DefaultEndStream } from "../StreamClass/abstract.js"
import { valueIsCurrEnd } from "../StreamClass/refactor.js"
import { withSuper } from "../../refactor.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

import { methods } from "./refactor.js"
const { init, ...baseMethods } = methods

const StreamParserBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false,
	state: boolean = false
) =>
	DefaultEndStream<Type>({
		...baseMethods,
		isCurrEnd: valueIsCurrEnd,
		hasPosition,
		buffer,
		state,
		isPattern: true
	}) as AbstractConstructor<[any], IStreamClassInstance<Type> & IPattern>

export function StreamParser<InType = any, OutType = any>(
	hasPosition: boolean = false,
	buffer: boolean = false,
	state: boolean = false
) {
	const baseClass = StreamParserBase(hasPosition, buffer, state)
	return function (
		handler: IStreamHandler<OutType>
	): Constructor<[IEndableStream?, Summat?], IStreamParser<InType, OutType>> {
		class streamTokenizerClass
			extends baseClass
			implements IStreamParser<InType, OutType>
		{
			value: IEndableStream<InType>
			super: Summat
			handler: IStreamHandler<OutType>

			pos?: number
			buffer?: IFreezableBuffer<OutType>
			state?: Summat

			init: (
				handler?: IStreamHandler<OutType>,
				value?: IEndableStream<InType>,
				state?: Summat
			) => IStreamParser<InType, OutType>

			constructor(value?: IEndableStream<InType>, state: Summat = {}) {
				super(value)
				this.init(handler, value, state)
			}
		}

		withSuper(streamTokenizerClass, baseClass, {
			init: ConstDescriptor(init)
		})

		return streamTokenizerClass
	}
}

export const BufferedParser = <InType = any, OutType = any>(
	hasPosition: boolean = false,
	state: boolean = false
) => StreamParser<InType, OutType>(hasPosition, true, state)

export const LocatorStream = <InType = any>(
	hasPosition: boolean = false,
	state: boolean = false
) => StreamParser<InType, boolean>(hasPosition, false, state)

export * from "./classes/PositionalValidator.js"
export * from "./classes/StreamValidator.js"
