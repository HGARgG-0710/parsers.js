import { number } from "@hgargg-0710/one"
import type { IParseable, IResourceSettable } from "../../../interfaces.js"
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
import { SourceStream } from "./BasicStream.js"

const { max, min } = number

export class InputStream<Type = any>
	extends SourceStream<Type, IParseable<Type>>
	implements
		IPeekableStream<Type>,
		INavigable<Type>,
		IFinishable<Type>,
		IRewindable<Type>,
		IPrevable,
		IResourceSettable,
		IInputStream<Type, IParseable<Type>>
{
	protected ["constructor"]: new (source?: IParseable<Type>) => this

	private _pos = 0
	private lastPos: number
	private readonly view: ReadableView

	private set pos(newPos: number) {
		this._pos = newPos
	}

	get pos() {
		return this._pos
	}

	protected currGetter(): Type {
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

	setResource(source: IParseable<Type>): void {
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

	constructor(source?: IParseable<Type>) {
		super(source)
		this.view = new ReadableView(0, this.source)
	}
}
