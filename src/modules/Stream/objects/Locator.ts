import type {
	IParseState,
	IStateHaving,
	IStream,
	IStreamLocator
} from "../../../interfaces.js"
import { negate } from "../../../modules/Stream/utils/StreamPosition.js"
import {
	OwnerDigger,
	ResourceDigger,
	type PropDigger
} from "../../../objects/PropDigger.js"
import { hasState } from "../../../utils/Stream.js"

/**
 * An abstract implementation of `IErrorPositionLocator` to represent
 * a locator based off an abstract `PropDigger` instance provided by
 * the child classes. The `locate()` algorithm implementation calls
 * the `dig` method on `inputStream`, with a negation of the search
 * predicate supplied via the constructor,
 */
export abstract class WithPropDigger<T = any>
	implements IStreamLocator<T & IStream>
{
	protected abstract get digger(): PropDigger

	locate(startStream: IStream): (T & IStream<any>) | null {
		return this.digger.dig(startStream, negate(this.predicate)) || null
	}

	constructor(private readonly predicate: (x: any) => x is T) {}
}

/**
 * A `WithPropDigger` case with `ownerDigger` as the `digger`.
 */
export class Upwards<T = any> extends WithPropDigger<T> {
	protected get digger(): PropDigger {
		return OwnerDigger.instance
	}
}

/**
 * A `WithPropDigger` case with `resourceDigger` as the `digger`.
 */
export class Downwards<T = any> extends WithPropDigger<T> {
	protected get digger(): PropDigger {
		return ResourceDigger.instance
	}
}

/**
 * This is a `WithPropDigger` Singleton-class for locating the nearest
 * (upwards or downwards) `IStream` (`IResourcefulStream/IOwnedStream`)
 * which is alos an `IStateHaving<IParseState>`.
 */
export class StatefulLocator extends WithPropDigger<IStateHaving<IParseState>> {
	static readonly upwards: StatefulLocator = new StatefulLocator(
		OwnerDigger.instance
	)
	static readonly downwards: StatefulLocator = new StatefulLocator(
		ResourceDigger.instance
	)

	protected get digger() {
		return this._digger
	}

	private constructor(private readonly _digger: PropDigger) {
		super(hasState)
	}
}
