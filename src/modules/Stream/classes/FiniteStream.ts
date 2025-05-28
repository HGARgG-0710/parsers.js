import { array } from "@hgargg-0710/one"
import type { IOwnedStream, IPosed } from "../../../interfaces.js"
import { ArrayStream } from "./ArrayStream.js"

const { lastIndex } = array

export class FiniteStream<Type = any>
	extends ArrayStream<Type, Type>
	implements IOwnedStream<Type>, IPosed
{
	private _pos: number = 0

	private set pos(newPos: number) {
		this._pos = newPos
	}

	get pos() {
		return this._pos
	}

	protected baseNextIter() {
		return this.items[++this.pos]
	}

	isCurrEnd() {
		return this.pos === lastIndex(this.items)
	}

	*[Symbol.iterator]() {
		yield* this.items
	}

	constructor(...items: Type[]) {
		super(...items)
	}
}
