import type { IInitializer } from "../../../interfaces.ts"
import type { BasicStream } from "./BasicStream.js"

/**
 * This is an abstract class extending `BasicStream<T, [SourceType]>`.
 * It sets the underlying `protected source: SourceType`, as well as `.copy`
 * method that (if possible) calls the `.copy()` method on the `.source`, and
 * then calls the constructor with it. It uses `resourceInitializer` as its
 * initializer, and provides `protected .initGetter`, which calls the
 * `protected abstract .currGetter(): T`.
 *
 * It also provides a `protected .updateCurr(): T` method,
 * which calls `this.update(this.currGetter())`.
 *
 * It is intended to be extended when one needs definitions for
 * `IInputStream`-classes, representing access to resources,
 * such as files, or open network connections.
 */
export declare abstract class SourceStream<
	T = any,
	SourceType = any
> extends BasicStream<T, [SourceType]> {
	protected ["constructor"]: new (source?: SourceType) => this
	protected abstract currGetter(): T
	protected source?: SourceType
	protected updateCurr(): void
	protected get initializer(): IInitializer
	protected initGetter(): T
	setResource(source?: SourceType): void
	copy(): this
	constructor(source?: SourceType)
}
