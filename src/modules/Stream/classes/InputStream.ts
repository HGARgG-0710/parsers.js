import { number } from "@hgargg-0710/one"
import type { IParseable } from "../../../interfaces.js"
import type {
	IFinishable,
	IInputStream,
	INavigable,
	IPeekableStream,
	IPosition,
	IPrevable,
	IRewindable
} from "../../../interfaces/Stream.js"
import { ReadableView } from "../../../internal/ReadableView.js"
import { uniNavigate } from "../../../utils/Stream.js"
import { isPredicatePosition } from "../utils/Position.js"
import { SourceStream, SourceStreamAnnotation } from "./SourceStream.js"

const { max, min } = number

class InputStreamAnnotation<T = any>
	extends SourceStreamAnnotation<T, IParseable<T>>
	implements
		IPeekableStream<T>,
		INavigable<T>,
		IFinishable<T>,
		IRewindable<T>,
		IPrevable,
		IInputStream<T, IParseable<T>>
{
	isCurrEnd(): boolean {
		return true
	}

	protected baseNextIter(): T {
		return null as T
	}

	protected currGetter(): T {
		return null as T
	}

	peek(n: number) {
		return null as T
	}

	navigate(position: IPosition<T>) {
		return null as T
	}

	finish() {
		return null as T
	}

	rewind() {
		return null as T
	}
}

function BuildInputStream<T = any>(): typeof InputStreamAnnotation<T> {
	return class
		extends SourceStream.generic!<T, IParseable<T>>()
		implements
			IPeekableStream<T>,
			INavigable<T>,
			IFinishable<T>,
			IRewindable<T>,
			IPrevable,
			IInputStream<T, IParseable<T>>
	{
		protected ["constructor"]: new (source?: IParseable<T>) => this

		private _pos = 0
		private lastPos: number
		private readonly view: ReadableView

		private set pos(newPos: number) {
			this._pos = newPos
		}

		get pos() {
			return this._pos
		}

		protected currGetter(): T {
			return this.source!.read(this.pos)
		}

		protected baseNextIter() {
			++this.pos
			this.view.forward()
			return this.currGetter()
		}

		protected basePrevIter() {
			--this.pos
			this.view.backward()
			return this.currGetter()
		}

		isCurrEnd(): boolean {
			return this.pos === this.source!.size
		}

		isCurrStart(): boolean {
			return this.pos === 0
		}

		setResource(source: IParseable<T>): void {
			super.setResource(source)
			this.lastPos = source.size - 1
			this.view.init(source)
		}

		navigate(relativePos: IPosition) {
			if (isPredicatePosition(relativePos))
				return uniNavigate(this, relativePos)

			this.pos = max(0, min(this.lastPos, this.lastPos + relativePos))
			this.updateCurr()
			return this.curr
		}

		rewind() {
			return this.navigate(0)
		}

		finish() {
			return this.navigate(this.lastPos)
		}

		peek(n: number) {
			return this.view.read(n)
		}

		constructor(source?: IParseable<T>) {
			super(source)
			this.view = new ReadableView(0, this.source)
		}
	} as unknown as typeof InputStreamAnnotation<T>
}

let inputStream: typeof InputStreamAnnotation | null = null

function PreInputStream<T = any>(): typeof InputStreamAnnotation<T> {
	return inputStream
		? inputStream
		: (inputStream = BuildInputStream<T>() as typeof InputStreamAnnotation)
}

export const InputStream = PreInputStream()
