import { Initializable } from "../../../classes/Initializer.js"
import type {
	IOwnedStream,
	IOwningStream,
	IStream
} from "../../../interfaces.js"

export abstract class IterableStream<Type = any, Args extends any[] = any[]>
	extends Initializable<Args>
	implements IStream<Type>
{
	abstract readonly isEnd: boolean
	abstract readonly isStart: boolean
	abstract readonly curr: Type

	abstract next(): void
	abstract isCurrEnd(): boolean
	abstract copy(): this

	*[Symbol.iterator]() {
		while (!this.isEnd) {
			yield this.curr
			this.next()
		}
	}

	constructor(...x: Partial<Args>) {
		super()
		this.init(...x)
	}
}

export abstract class OwnableStream<Type = any, Args extends any[] = any[]>
	extends IterableStream<Type, Args>
	implements IOwnedStream<Type>
{
	private _owner?: IOwningStream

	private set owner(newOwner: IOwningStream | undefined) {
		this._owner = newOwner
	}

	get owner() {
		return this._owner
	}

	setOwner(newOwner: IOwningStream): void {
		this.owner = newOwner
	}
}

export abstract class SolidStream<
	Type = any,
	Args extends any[] = any[]
> extends OwnableStream<Type, Args> {
	private _curr: Type
	private _isEnd: boolean = false
	private _isStart: boolean = true

	protected set curr(newCurr: Type) {
		this._curr = newCurr
	}

	get curr() {
		return this._curr
	}

	protected set isEnd(newIsEnd: boolean) {
		this._isEnd = newIsEnd
	}

	get isEnd() {
		return this._isEnd
	}

	protected set isStart(newIsStart: boolean) {
		this._isStart = newIsStart
	}

	get isStart() {
		return this._isStart
	}
}
