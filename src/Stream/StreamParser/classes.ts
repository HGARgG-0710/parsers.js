import type { Summat } from "@hgargg-0710/summat.ts"
import type { IFreezableBuffer } from "../../Collection/Buffer/interfaces.js"

import type { IStreamClassInstance } from "../../Stream/StreamClass/interfaces.js"
import type { IEndableStream } from "../interfaces.js"

import type { IConstructor } from "../StreamClass/refactor.js"
import type { IPattern } from "src/interfaces.js"
import type { IStreamParser, IStreamParserConstructor } from "./interfaces.js"

import type {
	IStreamPredicate,
	IStreamTransform
} from "../../TableMap/interfaces.js"

import { DefaultEndStream } from "../StreamClass/classes.js"
import { valueDelegate, withSuper } from "../../refactor.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

import { Autocache } from "../../internal/Autocache.js"
import { ArrayMap } from "../../IndexMap/LinearIndexMap/classes.js"

import { methods } from "./methods.js"
const { init, ...baseMethods } = methods

const valueIsCurrEnd = valueDelegate("isCurrEnd")

const StreamParserBase = <Type = any>(
	hasPosition: boolean = false,
	hasBuffer: boolean = false,
	hasState: boolean = false
) =>
	DefaultEndStream<Type>({
		...baseMethods,
		isCurrEnd: valueIsCurrEnd,
		hasPosition: hasPosition,
		hasBuffer: hasBuffer,
		hasState: hasState,
		isPattern: true
	}) as IConstructor<[any], IStreamClassInstance<Type> & IPattern>

function makeStreamParser<InType = any, OutType = any>(
	handler: IStreamTransform<InType, OutType>
): (
	hasPosition?: boolean,
	hasBuffer?: boolean,
	hasState?: boolean
) => IStreamParserConstructor<InType, OutType> {
	return function (
		hasPosition: boolean = false,
		hasBuffer: boolean = false,
		hasState: boolean = false
	) {
		const baseClass = StreamParserBase(hasPosition, hasBuffer, hasState)
		class streamTokenizerClass
			extends baseClass
			implements IStreamParser<InType, OutType>
		{
			readonly super: Summat
			readonly handler: IStreamTransform<InType, OutType>

			value: IEndableStream<InType>

			pos?: number
			buffer?: IFreezableBuffer<OutType>
			state?: Summat

			init: (
				value?: IEndableStream<InType>,
				buffer?: IFreezableBuffer<OutType>,
				state?: Summat
			) => IStreamParser<InType, OutType>

			constructor(
				value?: IEndableStream<InType>,
				buffer?: IFreezableBuffer<OutType>,
				state: Summat = {}
			) {
				super(value)
				this.init(value, buffer, state)
			}
		}

		withSuper(streamTokenizerClass, baseClass, {
			init: ConstDescriptor(init),
			handler: ConstDescriptor(handler)
		})

		return streamTokenizerClass
	}
}

const _StreamParser = new Autocache(new ArrayMap(), function <
	InType = any,
	OutType = any
>([handler, hasPosition, hasBuffer, hasState]: [
	IStreamTransform<InType, OutType>,
	boolean,
	boolean,
	boolean
]) {
	return makeStreamParser(handler)(hasPosition, hasBuffer, hasState)
})

export function StreamParser<InType = any, OutType = any>(
	handler: IStreamTransform<InType, OutType>
) {
	return function (
		hasPosition: boolean = false,
		hasBuffer: boolean = false,
		hasState: boolean = false
	): IStreamParserConstructor<InType, OutType> {
		return _StreamParser([handler, hasPosition, hasBuffer, hasState])
	}
}

export const BufferedParser =
	<InType = any, OutType = any>(
		hasPosition: boolean = false,
		hasState: boolean = false
	) =>
	(handler: IStreamTransform<InType, OutType>) =>
		StreamParser<InType, OutType>(handler)(hasPosition, true, hasState)

export const LocatorStream =
	<InType = any>(hasPosition: boolean = false, hasState: boolean = false) =>
	(predicate: IStreamPredicate<InType>) =>
		StreamParser<InType, boolean>(predicate)(hasPosition, false, hasState)

export * from "./classes/PositionalValidator.js"
export * from "./classes/StreamValidator.js"
