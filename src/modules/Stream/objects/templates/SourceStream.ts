import type { IResourceConnectable } from "../../../../interfaces.js"
import { resourceInitializer } from "../../../Initializable/objects/ResourceInitializer.js"
import { BasicStream } from "./BasicStream.js"

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
export abstract class SourceStream<T = any, SourceType = any>
	extends BasicStream<T, [SourceType]>
	implements IResourceConnectable<SourceType>
{
	protected abstract currGetter(): T
	protected source?: SourceType

	protected updateCurr() {
		this.update(this.currGetter())
	}

	protected baseNextIter() {
		return this.currGetter()
	}

	protected get initializer() {
		return resourceInitializer
	}

	protected initGetter() {
		return this.currGetter()
	}

	connectResource(source: SourceType) {
		this.source = source
	}

	baseInit() {}
}
