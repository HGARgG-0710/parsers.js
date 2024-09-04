import type { BasicStream } from "_src/types.js"
import type { Finishable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isFinishable = structCheck<Finishable>({ finish: isFunction })
export function finish(stream: BasicStream) {
	while (!stream.isEnd) stream.next()
	return stream.curr
}

// * Note: this is done (at all) because of HOW MUCH faster is finishing a Stream for certain implementations via '.finish' is (freq. example: InputStream), or can be made to be (ReversedStream);
// % Equivalently, similar "conditional call" universal methods are implemented throughout the library; These can allow to gain some significant long-term performance improvements from type-conversion of different Streams into 'InputStream' and/or others; 
export function uniFinish<Type = any>(stream: BasicStream<Type>) {
	return isFinishable(stream) ? stream.finish() : finish(stream)
}
