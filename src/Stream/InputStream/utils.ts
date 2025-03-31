import type { IPosition, IStream } from "../interfaces.js"
import type { IInputStream } from "./interfaces.js"

import { InputStream } from "./classes.js"
import { UnfreezableArray } from "../../Collection/Buffer/classes.js"

import { isBufferized } from "../../Collection/Buffer/utils.js"
import { consume } from "../utils.js"
import { uniFinish } from "../utils.js"

/**
 * Given a `BasicStream`, converts it to an `InputStream`
 */
export function toInputStream<
	Type = any,
	SubType = any,
	PosType extends IPosition = number
>(stream: IStream<Type, SubType, PosType>): IInputStream<Type> {
	if (isBufferized<Type>(stream)) {
		if (!stream.buffer.isFrozen) uniFinish(stream)
		return new InputStream(stream.buffer)
	}

	return new InputStream(
		consume(stream, new UnfreezableArray<Type>()).freeze()
	)
}
