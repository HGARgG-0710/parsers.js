import { array } from "@hgargg-0710/one"
import type { IOwnedStream, IPosed } from "../../../../interfaces.js"
import { ArrayStream } from "../templates.js"

const { lastIndex } = array

/**
 * This is a class implementing `IOwnedStream<T>` and `IPosed`.
 * It is an extension of `ArrayStream`.
 * It is defined via iteration through the provided finite list
 * of `.items`.
 */
export class FiniteStream<T = any>
	extends ArrayStream<T, T>
	implements IOwnedStream<T>, IPosed
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
}
