import { ArrayCollection } from "../../Collection/classes.js"
import { OutputBuffer } from "../../Collection/Sequence/classes.js"
import { isBufferized } from "../../Collection/Sequence/utils.js"
import type { IStream } from "../interfaces.js"
import { consume, finish } from "../utils.js"
import { InputStream } from "./classes.js"
import type { IInputStream } from "./interfaces.js"

/**
 * Given a `BasicStream`, converts it to an `InputStream`
 */
export function toInputStream<Type = any, SubType = any, PosType = any>(
	stream: IStream<Type, SubType, PosType>
): IInputStream<Type> {
	if (isBufferized<Type>(stream)) {
		if (!stream.buffer.isFrozen) finish(stream)
		return new InputStream(stream.buffer)
	}

	return new InputStream(
		new OutputBuffer<Type>(
			consume(stream, new ArrayCollection<Type>())
		).freeze()
	)
}
