import type { IFreeable } from "../../interfaces.js";
import type { ObjectPool } from "../../objects.js";
import { BaseNode } from "./BaseNode.js";


/**
 * This is a class that encapsulates the pooling logic for
 * `BaseNode<Args>` descendants. It is strongly recommended
 * for use as a parent whenever needing the pooling functionality
 * for the library's `INode` interface.
 *
 * The 'protected abstract readonly pool: ObjectPool' property
 * is intended to be overriden by the child classes, and to
 * contain the pool which would do the creation and the freeing
 * of the `INode<Args>` instances.
 */

export abstract class PoolableNode<Args extends any[] = any[]>
	extends BaseNode
	implements IFreeable {
	abstract init(...x: [] | Partial<Args>): this
	protected abstract readonly pool: ObjectPool

	free() {
		this.pool.free(this)
	}
}
