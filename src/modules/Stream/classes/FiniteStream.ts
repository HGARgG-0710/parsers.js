import { array } from "@hgargg-0710/one"
import type { IOwnedStream, IPosed } from "../../../interfaces.js"
import { ArrayStream, ArrayStreamAnnotation } from "./ArrayStream.js"

const { lastIndex } = array

class FiniteStreamAnnotation<T = any> extends ArrayStreamAnnotation<T> {
	protected baseNextIter(curr?: T | undefined): T {
		return null as T
	}

	isCurrEnd(): boolean {
		return true
	}
}

function BuildFiniteStream<T = any>() {
	return class FiniteStream
		extends ArrayStream.generic!<T, T>()
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

		constructor(...items: T[]) {
			super(...items)
		}
	} as unknown as typeof FiniteStreamAnnotation<T>
}

let finiteStream: typeof FiniteStreamAnnotation | null = null

function PreFiniteStream<T = any>(): typeof FiniteStreamAnnotation<T> {
	return finiteStream
		? finiteStream
		: (finiteStream =
				BuildFiniteStream<T>() as typeof FiniteStreamAnnotation)
}

export const FiniteStream: ReturnType<typeof PreFiniteStream> & {
	generic?: typeof PreFiniteStream
} = PreFiniteStream()

FiniteStream.generic = PreFiniteStream
