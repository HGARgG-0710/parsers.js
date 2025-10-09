import type {
	IIndexCarrying,
	IParseState,
	IPosed,
	IStateHaving,
	IStream,
	IStreamLocator
} from "../../../interfaces.js"
import type { IPropertyPath } from "../../../interfaces/PropertyPath.js"
import { negate } from "../../../modules/Stream/utils/StreamPosition.js"
import {
	OwnerPath,
	ResourcePath,
	type PropertyPath
} from "../../../objects/PropertyPath.js"
import { hasLineIndex, hasPos, hasState } from "../../../utils/Stream.js"

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
	protected get path(): PropertyPath {
		return OwnerPath.instance
	}
}

/**
 * A `WithPropDigger` case with `resourceDigger` as the `digger`.
 */
export class Downwards<T = any> extends WithPath<T> {
	protected get path(): PropertyPath {
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
		return this._digger
	}

	private constructor(private readonly _digger: PropertyPath) {
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

	private constructor(private readonly _path: PropertyPath) {
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

	private constructor(private readonly _path: PropertyPath) {
		super(hasLineIndex)
	}
}
