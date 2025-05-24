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
	abstract readonly curr: Type

	abstract next(): Type
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
