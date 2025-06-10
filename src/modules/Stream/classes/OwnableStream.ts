import type { IInitializable } from "../../../interfaces.js"
import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.js"

export abstract class OwnableStream<T = any, Args extends any[] = []>
	implements IOwnedStream<T>, IInitializable<Args>
{
	private _owner?: IOwningStream

	protected set owner(newOwner: IOwningStream | undefined) {
		this._owner = newOwner
	}

	get owner() {
		return this._owner
	}

	setOwner(newOwner: IOwningStream): void {
		this.owner = newOwner
	}

	abstract curr: T
	abstract isEnd: boolean
	abstract isStart: boolean

	abstract isCurrEnd(): boolean

	abstract next(): void

	abstract [Symbol.iterator](): Generator<T>

	abstract copy(): this

	abstract init(...args: Partial<Args>): this
}
