import { functional } from "@hgargg-0710/one"
import type {
	IIndexCarrying,
	IInputStream,
	IMarkerHaving,
	IParseState,
	IPosed,
	IStateHaving,
	IStream,
	IStreamLocator
} from "../../../interfaces.js"
import type { IPathFollower } from "../../../interfaces/PropertyPath.js"
import {
	OwnerFollower,
	ResourceFollower
} from "../../../objects/PropertyPath.js"
import {
	hasLineIndex,
	hasMarker,
	hasPos,
	hasState
} from "../../../utils/Stream.js"

const { negate } = functional

/**
 * An abstract implementation of `IErrorPositionLocator` to represent
 * a locator based off an abstract `PropDigger` instance provided by
 * the child classes. The `locate()` algorithm implementation calls
 * the `dig` method on `inputStream`, with a negation of the search
 * predicate supplied via the constructor,
 */
export abstract class WithPath<T = any> implements IStreamLocator<T & IStream> {
	protected abstract get follower(): IPathFollower<IStream, T & IStream>

	locate(startStream: IStream): (T & IStream<any>) | null {
		return this.follower.follow(startStream, negate(this.predicate)) || null
	}

	constructor(private readonly predicate: (x: any) => x is T) {}
}

/**
 * A `WithPropDigger` case with `ownerDigger` as the `digger`.
 */
export class Upwards<T = any> extends WithPath<T> {
	static readonly follower = new OwnerFollower()

	protected get follower(): IPathFollower {
		return Upwards.follower
	}
}

/**
 * A `WithPropDigger` case with `resourceDigger` as the `digger`.
 */
export class Downwards<T = any> extends WithPath<T> {
	static readonly follower = new ResourceFollower()

	protected get follower(): IPathFollower {
		return Downwards.follower
	}
}

/**
 * This is a `WithPropDigger` Singleton-class for locating the nearest
 * (upwards or downwards) `IStream` (`IResourcefulStream/IOwnedStream`)
 * which is alos an `IStateHaving<IParseState>`.
 */
export class StatefulLocator extends WithPath<IStateHaving<IParseState>> {
	static readonly upwards: StatefulLocator = new StatefulLocator(
		new OwnerFollower()
	)
	static readonly downwards: StatefulLocator = new StatefulLocator(
		new ResourceFollower()
	)

	protected get follower() {
		return this._follower
	}

	private constructor(private readonly _follower: IPathFollower) {
		super(hasState)
	}
}
/**
 * This is an `IStreamLocator` for upwards/downwards search of a stream
 * with a `.pos: number` property present.
 */
export class PosCarryingLocator extends WithPath<IPosed> {
	static readonly upwards = new PosCarryingLocator(new OwnerFollower())
	static readonly downwards = new PosCarryingLocator(new ResourceFollower())

	protected get follower() {
		return this._follower
	}

	private constructor(private readonly _follower: IPathFollower) {
		super(hasPos)
	}
}

/**
 * This is an `IStreamLocator` for upwards/downwards search of a stream
 * with a `.lineIndex: ILineIndex` property present.
 */
export class IndexCarryingLocator extends WithPath<IIndexCarrying> {
	static readonly upwards = new IndexCarryingLocator(new OwnerFollower())
	static readonly downwards = new IndexCarryingLocator(new ResourceFollower())

	protected get follower() {
		return this._follower
	}

	private constructor(private readonly _follower: IPathFollower) {
		super(hasLineIndex)
	}
}

/**
 * This is a Decorator class for existing `IStreamLocator<T>`s,
 * which caches the result, to avoid repeated calling of underlying
 * `locator: IStreamLocator<T>`. Useful for cases when the sought
 * item is guaranteed not to change its identity, i.e. when the
 * exact same object is queried from different places several
 * times via the `locate` method call.
 */
export class CachingLocator<T = any> implements IStreamLocator<T> {
	private result: T | null = null

	locate(inputStream: IInputStream): T | null {
		return this.result
			? this.result
			: (this.result = this.locator.locate(inputStream))
	}

	constructor(private readonly locator: IStreamLocator<T>) {}
}

/**
 * This is an extension of `WithPath<IMarkerHaving<M>>`, for locating
 * the next stream (upwards/downwards) with the `.marker: M` property of
 * value of `this.marker` (set by `setMarker(marker: M): this`).
 */
export class MarkerLocator<M = any> extends WithPath<IMarkerHaving<M>> {
	private marker: M

	static upwards() {
		return new MarkerLocator(new OwnerFollower())
	}

	static downwards() {
		return new MarkerLocator(new ResourceFollower())
	}

	setMarker(marker: M) {
		this.marker = marker
		return this
	}

	protected get follower() {
		return this._follower
	}

	private constructor(private readonly _follower: IPathFollower) {
		super(
			(x): x is IMarkerHaving => hasMarker(x) && x.marker === this.marker
		)
	}
}
