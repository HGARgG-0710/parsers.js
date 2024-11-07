import type { BufferizedStreamClassInstance, StreamClassInstance } from "../interfaces.js"
import { Stream } from "../../../constants.js"
import { getSetDescriptor } from "src/utils.js"
import { readBuffer } from "./next.js"

const { StreamClass } = Stream

// * utilty functions

export function initCurr<Type = any>(stream: StreamClassInstance<Type>) {
	stream.isStart = StreamClass.PostCurrInit
	return (stream.realCurr = stream.initGetter!())
}

export function isCurrUninitialized<Type = any>(stream: StreamClassInstance<Type>) {
	return stream.isStart === StreamClass.PreCurrInit
}

// * possible '.curr=' and '.curr' methods

export function set<Type = any>(this: StreamClassInstance<Type>, value: Type) {
	return (this.realCurr = value)
}

export function get<Type = any>(this: StreamClassInstance<Type>) {
	return isCurrUninitialized(this) ? initCurr(this) : this.realCurr
}

// * Explanation: when '.currGetter' is present, writes to '.curr' are ignored
// * (that is, it's intended that the '.baseNextIter'/'.basePrevIter' do all the high-level state-keeping)
export function setWithCurrGetter<Type = any>(
	this: StreamClassInstance<Type>,
	_curr: Type
) {}

export function getWithCurrGetter<Type = any>(this: StreamClassInstance<Type>) {
	if (this.isStart === StreamClass.PreCurrInit) this.isStart = StreamClass.PostCurrInit
	return this.currGetter!()
}

export const posBufferSet = get
export const posBufferGet = set

export const posBufferSetWithCurrGetter = setWithCurrGetter
export function posBufferGetWithCurrGetter<Type = any>(
	this: BufferizedStreamClassInstance<Type>
) {
	return this.buffer.isFrozen ? readBuffer(this) : this.currGetter!()
}

const methodList = [
	[set, get],
	[setWithCurrGetter, getWithCurrGetter],
	[posBufferSet, posBufferGet],
	[posBufferSetWithCurrGetter, posBufferGetWithCurrGetter]
] as [
	<Type = any>(this: StreamClassInstance<Type>, value: Type) => void,
	<Type = any>(this: StreamClassInstance<Type>) => Type
][]

export function chooseMethod<Type = any>(
	currGetter?: () => Type,
	pos: boolean = false,
	buffer: boolean = false
) {
	return getSetDescriptor(methodList[+!!currGetter | (+(pos && buffer) << 1)])
}
