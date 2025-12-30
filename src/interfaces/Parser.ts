import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	IDepthMark,
	IErrorData,
	IInitializable,
	IStateHaving
} from "../interfaces.js"
import type {
	IBasicStream,
	ILinkedStream,
	IOwnedStream,
	IStreamArray
} from "../interfaces/Stream.js"

export type IResultStateStream<T = any> = IOwnedStream<T> &
	IStateHaving<IBaseState>

export type IResultStateStreamMaker<Init = any, Out = any> = (
	getState?: () => Summat
) => (input: Init) => IResultStateStream<Out>

export interface IBaseState extends Summat {
	readonly errors: Error[]
}

/**
 * This is an interface employed by the library's
 * self-modifying parsers to store complex parser
 * state and allow the user to reference the parser's
 * internal state and composition (`.parse: IParse<FinalType, InitType>`).
 */
export interface IParseState<FinalType = any, InitType = any>
	extends IBaseState {
	readonly parse: IParse<FinalType, InitType>
	readonly errData: IErrorData
}

/**
 * This is an interface for representing a self-modifying
 * parser's internal [modifiable] `IStream`-composition
 * (`.streams: IStreamArray`), accessing its state
 * (`.state: IParserState`), and registering the changes
 * made to the `.streams: IStreamArray` via the `.update()`
 * call.
 */
export interface IParse<FinalType = any, InitType = any>
	extends IInitializable<[InitType?, Summat?]> {
	readonly state: IParseState<FinalType, InitType>
	readonly streams: IStreamArray
	renewStream(stream: ILinkedStream): boolean
	update(): void
	getDepth(mark: IDepthMark): number
}

export type IRootStream<T = any> = IBasicStream<T> & IStateHaving<IBaseState>
