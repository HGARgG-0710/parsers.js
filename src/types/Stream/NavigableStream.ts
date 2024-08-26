import { isNumber } from "src/misc.js"
import type { BasicStream } from "./BasicStream.js"
import { positionConvert, type Position } from "./Position.js"
import type { PositionalStream } from "./PositionalStream.js"
import type { TreeStream, MultiIndex } from "./TreeStream.js"

export interface NavigableStream<Type = any> extends BasicStream<Type> {
	navigate(position: Position): Type | void
}

export function inputStreamNavigate(
	this: PositionalStream & NavigableStream,
	index: Position
) {
	index = positionConvert(index)
	if (isNumber(index)) return this.input[(this.pos = index)]
	while (!this.isEnd && !index(this)) this.next()
	// TODO: REWRITE the interface in a fashion that this "as" information be supplied AS A PART OF THEM. Example: here, the 'inputStreamNavigate' is SUPPOSED to be used with a 'number' OR 'PositionObject' as '.pos';
	return this.input[positionConvert(this.pos) as number]
}

export function limitedStreamNavigate(position: Position) {
	position = positionConvert(position)
	return this.input.navigate(
		isNumber(position)
			? (positionConvert(this.input.pos) as number) + position
			: position
	)
}export function treeStreamNavigate<Type = any>(
	this: TreeStream<Type>,
	index: MultiIndex
) {
	this.pos = index
	this.walker.goIndex()
	return this.walker.current
}

