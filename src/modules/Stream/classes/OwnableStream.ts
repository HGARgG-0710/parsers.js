import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.js"
import { annotation } from "./annotation.js"

/**
 * This is an abstract class that implements `IOwnedStream<T>` and `IInitializable<Args>`.
 * It contains no concrete properties/methods, except for those required by the
 * `IOwnedStrea<T>` specifically, and not `IStream<T>`.
 *
 * It implementation of `setOwner` sets the encapsulated `readonly .owner: IOwningStream`
 * property, and the property itself can be set via the `protected set owner` setter
 * by its children classes alone.
 */
export abstract class OwnableStream<T = any, Args extends any[] = []>
	extends annotation<T, Args>
	implements IOwnedStream<T>
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
}
