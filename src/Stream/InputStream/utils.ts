import { InputStream as InputStreamConstructor } from "./classes.js"

import type { BasicStream } from "../interfaces.js"
import type { InputStream } from "./interfaces.js"
import type { ArrayCollection } from "../../Collection/classes.js"

import { UnfreezableArray } from "../../Collection/Buffer/classes.js"
import { isBufferized } from "../../Collection/Buffer/utils.js"
import { array } from "../../Parser/utils.js"
import { uniFinish } from "../StreamClass/utils.js"

/**
 * Given a `BasicStream`, converts it to an `InputStream` for the price of a single iteration.
 */
export function toInputStream<Type = any>(stream: BasicStream<Type>): InputStream<Type> {
	if (isBufferized<Type>(stream)) {
		if (!stream.buffer.isFrozen) uniFinish(stream)
		return new InputStreamConstructor(stream.buffer)
	}

	return new InputStreamConstructor(
		new UnfreezableArray(
			(array(stream) as ArrayCollection<Type>).get() as Type[]
		).freeze()
	)
}
