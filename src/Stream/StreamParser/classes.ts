import { object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { IFreezableBuffer } from "../../Collection/Buffer/interfaces.js"
import { ArrayMap } from "../../IndexMap/LinearIndexMap/classes.js"
import { Autocache } from "../../internal/Autocache.js"
import { withSuper } from "../../refactor.js"
import type {
	IStreamPredicate,
	IStreamTransform
} from "../../TableMap/interfaces.js"
import type { IEndableStream } from "../interfaces.js"
import { DefaultEndStream } from "../StreamClass/classes.js"
import {
	valueIsCurrEnd,
	type IConstructor,
	type IStreamClassInstanceImpl
} from "../StreamClass/refactor.js"
import type { IStreamParserConstructor } from "./interfaces.js"
import { methods, type IStreamParserImpl } from "./methods.js"
const { ConstDescriptor } = object.descriptor
const { init, ...baseMethods } = methods

const StreamParserBase = <Type = any>(
	hasPosition = false,
	hasBuffer = false,
	hasState = false
) =>
	DefaultEndStream<Type>({
		...baseMethods,
		isCurrEnd: valueIsCurrEnd,
		hasPosition: hasPosition,
		hasBuffer: hasBuffer,
		hasState: hasState,
		isPattern: true
	}) as IConstructor<[any], IStreamClassInstanceImpl<Type>>

function makeStreamParser<InType = any, OutType = any>(
	handler: IStreamTransform<InType, OutType>
): (
	hasPosition?: boolean,
	hasBuffer?: boolean,
	hasState?: boolean
) => IStreamParserConstructor<InType, OutType> {
	return function (hasPosition = false, hasBuffer = false, hasState = false) {
		const baseClass = StreamParserBase(hasPosition, hasBuffer, hasState)
		class streamTokenizerClass
			extends baseClass
			implements IStreamParserImpl<InType, OutType>
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
			) => IStreamParserImpl<InType, OutType>

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
		hasPosition = false,
		hasBuffer = false,
		hasState = false
	): IStreamParserConstructor<InType, OutType> {
		return _StreamParser([handler, hasPosition, hasBuffer, hasState])
	}
}

export const BufferedParser =
	<InType = any, OutType = any>(hasPosition = false, hasState = false) =>
	(handler: IStreamTransform<InType, OutType>) =>
		StreamParser<InType, OutType>(handler)(hasPosition, true, hasState)

export const LocatorStream =
	<InType = any>(hasPosition = false, hasState = false) =>
	(predicate: IStreamPredicate<InType>) =>
		StreamParser<InType, boolean>(predicate)(hasPosition, false, hasState)

export * from "./classes/IndexStream.js"
export * from "./classes/PositionalValidator.js"
export * from "./classes/StreamValidator.js"
