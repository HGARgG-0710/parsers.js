import type { IPosed, IPosition } from "../../Position/interfaces.js"
import type { IReversibleStream } from "../../interfaces.js"
import type { IBufferized } from "../../../Collection/Buffer/interfaces.js"
import type { IReversedStreamClassInstance } from "../interfaces.js"

import { uniNavigate } from "../utils.js"
import { readBuffer, readBufferThis } from "../refactor.js"
import { direction, positionConvert } from "../../Position/utils.js"
import { positionDecrement } from "../../Position/refactor.js"

import { type } from "@hgargg-0710/one"
const { isNumber } = type

/**
 * A definition of `.navigate` method that works for any `Stream`
 * 		(used as default, overriden in some classes for performance reasons)
 */

function navigate<Type = any>(
	this: IReversibleStream<Type>,
	position: IPosition
) {
	return uniNavigate(this, position)
}

const posNavigate = navigate
const bufferNavigate = navigate

function posBufferNavigate<Type = any>(
	this: IReversedStreamClassInstance<Type> &
		IBufferized<Type> &
		IPosed<number>,
	position: IPosition<Type>
) {
	const dirpos = positionConvert(position)

	if (isNumber(dirpos)) {
		const { buffer, pos } = this

		if (buffer.isFrozen || buffer.size > pos + dirpos) {
			this.pos = Math.min(Math.max(pos + dirpos, 0), buffer.size)
			return readBuffer(this)
		}

		let i = dirpos
		if (dirpos > 0) while (i++) this.prev()
		else while (i--) this.next()
	} else {
		if (direction(dirpos)) uniNavigate(this, dirpos)
		else while (!dirpos(readBufferThis(this))) positionDecrement(this)
	}

	return this.curr
}

const methodList = [navigate, posNavigate, bufferNavigate, posBufferNavigate]

export function chooseMethod<Type = any>(
	hasPosition: boolean = false,
	hasBuffer: boolean = false
) {
	return methodList[+hasPosition | (+hasBuffer << 1)]<Type>
}
