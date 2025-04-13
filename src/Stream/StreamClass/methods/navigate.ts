import type { IPosed } from "../../Position/interfaces.js"
import type {
	IDirectionalPosition,
	IReversibleStream
} from "../../interfaces.js"
import type { IBufferized } from "../../../Collection/Buffer/interfaces.js"
import type { IReversedStreamClassInstance } from "../interfaces.js"

import { uniNavigate } from "src/Stream/utils.js"
import { readBuffer, readBufferThis } from "../refactor.js"
import { direction } from "../../Position/utils.js"
import { positionDecrement } from "../../Position/refactor.js"

import { type } from "@hgargg-0710/one"
import { BitHash } from "../../../HashMap/classes.js"
import { ArrayInternal } from "../../../HashMap/InternalHash/classes.js"
const { isNumber } = type

/**
 * A definition of `.navigate` method that works for any `Stream`
 * 		(used as default, overriden in some classes for performance reasons)
 */
function navigate<Type = any>(
	this: IReversibleStream<Type>,
	position: IDirectionalPosition
) {
	return uniNavigate(this, position)
}

const posNavigate = navigate
const bufferNavigate = navigate

function posBufferNavigate<Type = any>(
	this: IReversedStreamClassInstance<Type> &
		IBufferized<Type> &
		IPosed<number>,
	position: IDirectionalPosition<Type>
) {
	if (isNumber(position)) {
		const { buffer, pos } = this

		if (buffer.isFrozen || buffer.size > pos + position) {
			this.pos = Math.min(Math.max(pos + position, 0), buffer.size)
			return readBuffer(this)
		}

		let i = position
		if (position > 0) while (i++) this.prev()
		else while (i--) this.next()
	} else {
		if (direction(position)) uniNavigate(this, position)
		else while (!position(readBufferThis(this))) positionDecrement(this)
	}

	return this.curr
}

const MethodHash = new BitHash(
	new ArrayInternal([
		navigate,
		posNavigate,
		bufferNavigate,
		posBufferNavigate
	])
)

export function chooseMethod(
	hasPosition: boolean = false,
	hasBuffer: boolean = false
) {
	return MethodHash.index([hasPosition, hasBuffer])
}
