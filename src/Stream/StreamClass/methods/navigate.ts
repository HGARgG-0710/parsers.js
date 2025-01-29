import type { Position } from "../../../Position/interfaces.js"
import type { BasicReversibleStream } from "../../../Stream/ReversibleStream/interfaces.js"
import type {
	BufferizedReversedStreamClassInstance,
	PositionalReversedStreamClassInstance
} from "../interfaces.js"

import { uniNavigate } from "../utils.js"
import { readBuffer } from "../refactor.js"
import { isBackward, positionConvert } from "../../../Position/utils.js"
import { positionDecrement } from "src/Position/refactor.js"

import { type } from "@hgargg-0710/one"
const { isNumber } = type

export interface Navigable<Type = any> {
	navigate: (position: Position) => Type
}

/**
 * A definition of `.navigate` method that works for any `Stream`
 * 		(used as default, overriden in some classes for performance reasons)
 */

function navigate<Type = any>(this: BasicReversibleStream<Type>, position: Position) {
	return uniNavigate(this, position)
}

const posNavigate = navigate
const bufferNavigate = navigate

function posBufferNavigate<Type = any>(
	this: BufferizedReversedStreamClassInstance<Type> &
		PositionalReversedStreamClassInstance<Type>,
	position: Position
) {
	const converted = positionConvert(position)

	if (isNumber(converted)) {
		const { buffer, pos } = this

		if (buffer.isFrozen || buffer.size > pos + converted) {
			this.pos = Math.min(Math.max(pos + converted, 0), buffer.size)
			return readBuffer(this)
		}

		let i = converted
		if (converted > 0) while (i++) this.prev()
		else while (i--) this.next()
	} else {
		if (isBackward(converted))
			while (!converted(readBuffer(this))) positionDecrement(this)
		else uniNavigate(this, converted)
	}

	return this.curr
}

const methodList = [navigate, posNavigate, bufferNavigate, posBufferNavigate]

export function chooseMethod<Type = any>(pos: boolean = false, buffer: boolean = false) {
	return methodList[+pos | (+buffer << 1)]<Type>
}
