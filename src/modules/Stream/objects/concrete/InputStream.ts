import { number } from "@hgargg-0710/one"
import type {
	IBaseInitializable,
	IParseable,
	IPosed
} from "../../../../interfaces.js"
import type {
	IFinishable,
	IInputStream,
	INavigable,
	IPeekable
} from "../../../../interfaces/Stream.js"
import { ReadableView } from "../../../../internal/ReadableView.js"
import { skip } from "../../../../utils/Stream.js"
import type { IStreamStep } from "../../interfaces/StreamPosition.js"
import { isStreamPredicate } from "../../utils/Step.js"
import { SourceStream } from "../templates.js"

const { max, min } = number

/**
 * This is a class extending `SourceStream` and implementing
 * `IStream<T>`, `IPeekable<T>`, `INavigable<T>`, `IFinishable<T>`,
 * `IInputStream<T, IParseable<T>>` and `IPosed<number>`.
 *
 * The stream can also be restored to its initial state by
 * calling the `.rewind()` method.
 *
 * It uses the `IParseable<T>`'s natural interface as a
 * structure with contigious read-access, thus permitting
 * an array-like model of iteration.
 */
export class InputStream<T = any>
	extends SourceStream<T, IParseable<T>>
	implements
		IInputStream<T, IParseable<T>>,
		IPeekable<T>,
		INavigable<T>,
		IFinishable<T>,
		IPosed,
		IBaseInitializable
{
	protected ["constructor"]: new (source?: IParseable<T>) => this

	private _pos = 0
	private lastPos: number
	private readonly view: ReadableView<T>

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
		return super.baseNextIter()
	}

	isCurrEnd(): boolean {
		return this.pos === this.source!.size
	}

	baseInit(): void {
		this.lastPos = this.source!.size - 1
		this.view.init(this.source!)
	}

	private navigateInt(relativePos: number) {
		this.pos = max(0, min(this.lastPos, this.lastPos + relativePos))
		this.updateCurr()
		return this.curr
	}

	navigate(relativePos: IStreamStep) {
		return isStreamPredicate(relativePos)
			? skip(this, relativePos)
			: this.navigateInt(relativePos)
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

	toPeek(n: number): void {
		this.view.forward(n)
	}

	hasPeek(n: number): boolean {
		return this.view.has(n)
	}

	constructor(source?: IParseable<T>) {
		super(source)
		this.view = new ReadableView(0, this.source)
	}
}
