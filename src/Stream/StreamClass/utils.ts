import type { Summat } from "@hgargg-0710/summat.ts"
import type { Position } from "../../Position/interfaces.js"
import type { BasicReversibleStream } from "../ReversibleStream/interfaces.js"
import type { BasicStream, Endable } from "../interfaces.js"
import type { Rewindable } from "./methods/rewind.js"
import type { Finishable } from "./methods/finish.js"
import type { Navigable } from "./methods/navigate.js"
import type {
	BufferizedStreamClassInstance,
	PreStarted,
	ReversedStreamClassInstance,
	Stateful,
	StreamClassInstance
} from "./interfaces.js"

import { calledDelegate } from "../../utils.js"
import { pickDirection, positionConvert } from "../../Position/utils.js"

import { Stream, defaults } from "../../constants.js"
const { StreamClass } = Stream
const { realCurr: defaultRealCurr } = defaults.StreamClass

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isNumber } = type

export const superDelegate = calledDelegate("super")
export const superInit = superDelegate("init")

export const isFinishable = structCheck<Finishable>({ finish: isFunction })
export const isNavigable = structCheck<Navigable>({ navigate: isFunction })
export const isRewindable = structCheck<Rewindable>({ rewind: isFunction })

/**
 * Iterates the given `BasicStream` until hitting the end.
 * When an alternative `.finish()` method is present, it is likely faster.
 */
export function uniFinish<Type = any>(stream: BasicStream<Type>) {
	while (!stream.isEnd) stream.next()
	return stream.curr
}

export function fastFinish<Type = any>(stream: BasicStream<Type>) {
	return isFinishable(stream) ? stream.finish() : uniFinish<Type>(stream)
}

/**
 * General implementation of the 'navigate' operation for a given `stream`
 * (note: when available, calling `stream.navigate()` is typically faster);
 *
 * Provided with a `Stream` and a `Position`, it:
 *
 * * 1. converts all the `PositionObject`-s into `DirectionalPosition`-s;
 * * 2. if the result of the conversion is `number` and it is negative, calls the `stream.prev()` this many times;
 * * 3. if the result of the conversion is `number` and it is positive, calls the `stream.next()` this many times;
 * * 4. if the result of the conversion is `PredicatePosition`, continues to walk the stream until either it is over, or the condition given is met;
 * @returns `stream.curr`
 */
export function uniNavigate<Type = any>(
	stream: BasicReversibleStream<Type>,
	position: Position
): Type {
	if (isNumber((position = positionConvert(position, stream)))) {
		if (position < 0) while (position++) stream.prev()
		else while (position--) stream.next()
	} else {
		const change = pickDirection(position)
		while (!stream.isEnd && !position(stream)) change(stream)
	}

	return stream.curr
}

export function fastNavigate<Type = any>(
	stream: BasicReversibleStream<Type>,
	position: Position
) {
	return isNavigable(stream)
		? stream.navigate(position)
		: uniNavigate<Type>(stream, position)
}

/**
 * Performs a universal `rewind`ing operaion on the given `ReversibleStream`.
 * Continues to call '.prev()' on the given `Stream`, until `stream.isStart` is true;
 * @returns `stream.curr`
 */
export function uniRewind<Type = any>(stream: BasicReversibleStream<Type>) {
	while (!stream.isStart) stream.prev()
	return stream.curr
}

export function fastRewind<Type = any>(stream: BasicReversibleStream<Type>): Type {
	return isRewindable(stream) ? stream.rewind() : uniRewind(stream)
}

export function initCurr<Type = any>(stream: StreamClassInstance<Type>) {
	start(stream)
	return (stream.realCurr = stream.initGetter!())
}

export function isCurrUninitialized<Type = any>(stream: StreamClassInstance<Type>) {
	return stream.isStart === StreamClass.PreCurrInit
}

export function preStart(stream: PreStarted) {
	stream.isStart = StreamClass.PreCurrInit
}

export function start(stream: PreStarted) {
	stream.isStart = StreamClass.PostCurrInit
}

export function deStart(stream: StreamClassInstance) {
	stream.isStart = StreamClass.PostStart
}

export function preEnd(stream: StreamClassInstance) {
	stream.isEnd = stream.defaultIsEnd()
}

export function end(stream: StreamClassInstance) {
	stream.isEnd = true
}

export function isEmptyStream(stream: StreamClassInstance) {
	return stream.isEnd && stream.isStart
}

export function deEnd(stream: Endable) {
	stream.isEnd = false
}

// * Explanation: For 'StreamClassInstance'-s, it's a call to the 'initGetter', or a first call to 'currGetter'
export function preInit(x: BasicStream) {
	if (!x.isEnd) x.curr
}

export function createState(x: Stateful, state: Summat) {
	x.state = state
}

export function realCurr(stream: StreamClassInstance) {
	stream.realCurr = defaultRealCurr
}

export function getNext<Type = any>(stream: StreamClassInstance<Type>) {
	return (stream.curr = stream.baseNextIter())
}

export function readBuffer<Type = any>(stream: BufferizedStreamClassInstance<Type>) {
	return (stream.curr = stream.buffer.read(stream.pos))
}

export function getPrev<Type = any>(stream: ReversedStreamClassInstance<Type>) {
	return (stream.curr = stream.basePrevIter())
}
