import { InputStream as InputStreamConstructor } from "./classes.js"

import type { BasicStream } from "../interfaces.js"
import type { InputStream } from "./interfaces.js"

import type { FreezableBuffer } from "src/Collection/Buffer/interfaces.js"

import { array } from "../../Parser/utils.js"
import { isBufferized } from "src/Collection/Buffer/utils.js"

/**
 * Given a `BasicStream`, converts it to an `InputStream` for the price of a single iteration.
 */
export function toInputStream<Type = any>(stream: BasicStream<Type>): InputStream<Type> {
	return new InputStreamConstructor(
		isBufferized(stream)
			? stream.buffer.isFrozen
				? stream.buffer
				: (array(stream, stream.buffer) as FreezableBuffer<Type>)
			: (array(stream) as FreezableBuffer<Type>)
	)
}
