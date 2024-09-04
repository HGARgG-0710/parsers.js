import { function as _f, typeof as type, boolean } from "@hgargg-0710/one"
const { trivialCompose } = _f
const { isNumber } = type
const { not } = boolean

import { preserveDirection } from "../PositionalStream/Position/utils.js"
import { iterationChoice } from "../PositionalStream/Position/utils.js"
import type { InputStream } from "../InputStream/interfaces.js"
import type { Position } from "../PositionalStream/Position/interfaces.js"
import { positionConvert } from "../PositionalStream/Position/utils.js"
import type { LimitedStream } from "../LimitedStream/interfaces.js"
import type { TreeStream, MultiIndex } from "_src/types.js"

export function inputStreamNavigate<Type = any>(
	this: InputStream<Type>,
	index: Position
) {
	index = positionConvert(index)
	if (isNumber(index)) {
		if (index < 0) index += this.input.length
		return this.input[(this.pos = index)]
	}
	const [change, predicate] = iterationChoice(
		preserveDirection(index, (x) => trivialCompose(not, x))
	)
	while (predicate(this)) change(this)
	return this.input[positionConvert(this.pos) as number]
}

export function limitedStreamNavigate<Type = any>(
	this: LimitedStream<Type>,
	position: Position
) {
	position = positionConvert(position)
	return this.input.navigate(
		isNumber(position)
			? Math.max((positionConvert(this.input.pos) as number) + position, 0)
			: position
	)
}export function treeStreamNavigate<Type = any>(
	this: TreeStream<Type>,
	index: MultiIndex
) {
	this.pos = index
	this.walker.goIndex()
	return this.curr
}

