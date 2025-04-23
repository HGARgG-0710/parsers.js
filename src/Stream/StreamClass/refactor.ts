import type { Summat } from "@hgargg-0710/summat.ts"
import type { IStateful } from "src/interfaces.js"
import type { IBufferized } from "../../Collection/Buffer/interfaces.js"
import { valueDelegate, valuePropDelegate } from "../../refactor.js"
import type {
	IFinishable,
	IIsEndCurrable,
	IIsStartCurrable,
	INavigable,
	IPosition,
	IReversedStreamClassInstance,
	IRewindable,
	IStarted,
	IStreamClassInstance
} from "../interfaces.js"
import type { IPosed } from "../Position/interfaces.js"
import curr from "./methods/curr.js"

export type IConstructor<Signature extends any[], Type = any> = new (
	...x: Signature
) => Type

export function start(stream: IStarted) {
	stream.isStart = true
}

export function deStart(stream: IStarted) {
	stream.isStart = false
}

export function end(stream: IStreamClassInstanceImpl) {
	stream.isEnd = true
}

export function deEnd(stream: IStreamClassInstanceImpl) {
	stream.isEnd = false
}

export function createState(x: IStateful, state: Summat) {
	;(x.state as Summat) = state
}

export function readBuffer<Type = any>(
	stream: IStreamClassInstanceImpl<Type> & IBufferized<Type> & IPosed<number>
) {
	return (stream.curr = stream.buffer.read(stream.pos))
}

export function readBufferThis<Type = any>(
	stream: IStreamClassInstanceImpl<Type> & IPosed<number> & IBufferized<Type>
) {
	readBuffer(stream)
	return stream
}

export const valueIsCurrEnd = valueDelegate("isCurrEnd")

export const valueCurr = valuePropDelegate("curr")

export const valueIsCurrStart = valueDelegate("isCurrStart")

interface IBasePrevIterable<Type = any> {
	basePrevIter: () => Type
}

export interface IUpdatable<Type = any> {
	update: () => Type
}

export type IStreamClassTransferable<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IPrimalStreamClassSignature<Type> &
	Partial<IDefaultIsEndable> &
	Partial<IBasePrevIterable<Type>> &
	Partial<IIsStartCurrable> &
	Partial<INavigable<Type, SubType, PosType>> &
	Partial<IFinishable<Type>> &
	Partial<IRewindable<Type>>

export interface IDefaultIsEndable {
	defaultIsEnd: () => boolean
}

type IPrimalStreamClassSignature<Type = any> = IIsEndCurrable & {
	baseNextIter: () => Type
	initGetter?: () => Type
	currGetter?: () => Type
}

type ICommonStreamClassInstance<Type = any> =
	IPrimalStreamClassSignature<Type> & IDefaultIsEndable

export type IStreamClassInstanceImpl<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number,
	InitSignature extends any[] = any[]
> = ICommonStreamClassInstance<Type> &
	IStreamClassInstance<Type, SubType, PosType, InitSignature> &
	IStreamClassTransferable<Type> &
	Partial<Pick<IReversedStreamClassInstanceImpl<Type>, "prev">> &
	Partial<IUpdatable<Type>>

export type IReversedStreamClassInstanceImpl<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number,
	InitSignature extends any[] = any[]
> = ICommonStreamClassInstance<Type> &
	IReversedStreamClassInstance<Type, SubType, PosType, InitSignature> &
	IBasePrevIterable<Type>

export { curr }

export * as copy from "./methods/copy.js"
export * as finish from "./methods/finish.js"
export * as init from "./methods/init.js"
export * as iter from "./methods/iter.js"
export * as navigate from "./methods/navigate.js"
export * as rewind from "./methods/rewind.js"

