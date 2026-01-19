import type {
	IOwnedStream,
	IOwningStream
} from "../../interfaces/OwnedStream.js"

/**
 * This is an abstract class that implements `IOwnedStream<T>` and `IInitializable<Args>`.
 * It contains no concrete properties/methods, except for those required by the
 * `IOwnedStream<T>` specifically, and not `IStream<T>`.
 *
 * It implementation of `connectOwner` sets the encapsulated `readonly .owner: IOwningStream`
 * property, and the property itself can be set via the `protected set owner` setter
 * by its children classes alone.
 */
export abstract class OwnableStream<T = any> implements IOwnedStream<T> {
	abstract readonly isEnd: boolean
	abstract readonly curr: T
	abstract next(): void
	abstract isCurrEnd(): boolean

	private _owner: IOwningStream | null

	protected set owner(newOwner: IOwningStream | null) {
		this._owner = newOwner
	}

	get owner() {
		return this._owner
	}

	connectOwner(newOwner: IOwningStream): void {
		this.owner = newOwner
	}

	resetOwner(): void {
		this.owner = null
	}
}
