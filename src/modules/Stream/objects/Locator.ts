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
import type { IPropertyPath } from "../../../interfaces/PropertyPath.js"
import { negate } from "../../../modules/Stream/utils/StreamPosition.js"
import { OwnerPath, ResourcePath } from "../../../objects/PropertyPath.js"
import {
	hasLineIndex,
	hasMarker,
	hasPos,
	hasState
} from "../../../utils/Stream.js"

/**
 * An abstract implementation of `IErrorPositionLocator` to represent
 * a locator based off an abstract `PropDigger` instance provided by
 * the child classes. The `locate()` algorithm implementation calls
 * the `dig` method on `inputStream`, with a negation of the search
 * predicate supplied via the constructor,
 */
export abstract class WithPath<T = any> implements IStreamLocator<T & IStream> {
	protected abstract get path(): IPropertyPath<IStream, T & IStream>

	locate(startStream: IStream): (T & IStream<any>) | null {
		return this.path.follow(startStream, negate(this.predicate)) || null
	}

	constructor(private readonly predicate: (x: any) => x is T) {}
}

/**
 * A `WithPropDigger` case with `ownerDigger` as the `digger`.
 */
export class Upwards<T = any> extends WithPath<T> {
	protected get path(): IPropertyPath {
		return OwnerPath.instance
	}
}

/**
 * A `WithPropDigger` case with `resourceDigger` as the `digger`.
 */
export class Downwards<T = any> extends WithPath<T> {
	protected get path(): IPropertyPath {
		return ResourcePath.instance
	}
}

/**
 * This is a `WithPropDigger` Singleton-class for locating the nearest
 * (upwards or downwards) `IStream` (`IResourcefulStream/IOwnedStream`)
 * which is alos an `IStateHaving<IParseState>`.
 */
export class StatefulLocator extends WithPath<IStateHaving<IParseState>> {
	static readonly upwards: StatefulLocator = new StatefulLocator(
		OwnerPath.instance
	)
	static readonly downwards: StatefulLocator = new StatefulLocator(
		ResourcePath.instance
	)

	protected get path() {
		return this._path
	}

	private constructor(private readonly _path: IPropertyPath) {
		super(hasState)
	}
}
/**
 * This is an `IStreamLocator` for upwards/downwards search of a stream
 * with a `.pos: number` property present.
 */
export class PosCarryingLocator extends WithPath<IPosed> {
	static readonly upwards = new PosCarryingLocator(OwnerPath.instance)
	static readonly downwards = new PosCarryingLocator(ResourcePath.instance)

	protected get path() {
		return this._path
	}

	private constructor(private readonly _path: IPropertyPath) {
		super(hasPos)
	}
}

/**
 * This is an `IStreamLocator` for upwards/downwards search of a stream
 * with a `.lineIndex: ILineIndex` property present.
 */
export class IndexCarryingLocator extends WithPath<IIndexCarrying> {
	static readonly upwards = new IndexCarryingLocator(OwnerPath.instance)
	static readonly downwards = new IndexCarryingLocator(ResourcePath.instance)

	protected get path() {
		return this._path
	}

	private constructor(private readonly _path: IPropertyPath) {
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
		return new MarkerLocator(OwnerPath.instance)
	}

	static downwards() {
		return new MarkerLocator(ResourcePath.instance)
	}

	setMarker(marker: M) {
		this.marker = marker
		return this
	}

	protected get path() {
		return this._path
	}

	private constructor(private readonly _path: IPropertyPath) {
		super(
			(x): x is IMarkerHaving => hasMarker(x) && x.marker === this.marker
		)
	}
}
