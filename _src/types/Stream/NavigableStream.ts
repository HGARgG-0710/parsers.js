import { iterationChoice, preserveDirection } from "../../misc.js"
import type { BasicStream } from "./BasicStream.js"
import { positionConvert, type Position } from "./Position.js"
import type { TreeStream, MultiIndex } from "./TreeStream.js"

import type { InputStream } from "./InputStream.js"
import type { LimitedStream } from "./LimitedStream.js"

import { function as _f, typeof as type, boolean } from "@hgargg-0710/one"
import { isNavigable, type Navigable } from "src/interfaces/Navigable.js"
import type { ReversibleStream } from "main.js"
const { trivialCompose } = _f
const { isNumber } = type
const { not } = boolean

export interface NavigableStream<Type = any>
	extends BasicStream<Type>,
		Navigable<Type | void, Position> {}

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
}

export function treeStreamNavigate<Type = any>(
	this: TreeStream<Type>,
	index: MultiIndex
) {
	this.pos = index
	this.walker.goIndex()
	return this.curr
}

export function uniNavigate<Type = any>(
	stream: ReversibleStream<Type>,
	position: Position
): Type {
	if (isNavigable(stream)) return stream.navigate(position)
	const [change, endPredicate] = iterationChoice(positionConvert(position))
	while (!endPredicate) change(stream)
	return stream.curr
}
