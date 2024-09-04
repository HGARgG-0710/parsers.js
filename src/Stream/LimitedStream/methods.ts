import type { DualPosition } from "../PositionalStream/Position/interfaces.js";
import { LimitedStream } from "./classes.js";
import type { BoundableStream } from "./interfaces.js";


export function limitStream<Type = any>(this: BoundableStream<Type>, dual: DualPosition) {
	return LimitedStream<Type>(this, dual)
}
