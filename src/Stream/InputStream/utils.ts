import type { BasicStream } from "../interfaces.js"
import type { IInputStream } from "./interfaces.js"
import type { ArrayCollection } from "../../Collection/classes.js"

import { InputStream } from "./classes.js"
import { UnfreezableArray } from "../../Collection/Buffer/classes.js"

import { isBufferized } from "../../Collection/Buffer/utils.js"
import { consume } from "../../Parser/utils.js"
import { uniFinish } from "../StreamClass/utils.js"

/**
 * Given a `BasicStream`, converts it to an `InputStream`
 */
export function toInputStream<Type = any>(stream: BasicStream<Type>): IInputStream<Type> {
	if (isBufferized<Type>(stream)) {
		if (!stream.buffer.isFrozen) uniFinish(stream)
		return new InputStream(stream.buffer)
	}

	return new InputStream(
		new UnfreezableArray(
			(consume(stream) as ArrayCollection<Type>).get() as Type[]
		).freeze()
	)
}
