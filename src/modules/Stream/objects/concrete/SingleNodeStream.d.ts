import type { NodeStream } from "../templates/NodeStream.js"

/**
 * This is a special case of `NodeStream<T>` which only
 * expects a single element (i.e. `.next()` finishes it,
 * and `isCurrEnd()` always returns `true`). It should
 * have its `setResource` method overriden to provide proper
 * `.curr`-creation logic.
 */
export declare abstract class SingleNodeStream<T = any> extends NodeStream<T> {
	isCurrEnd(): boolean
	next(): void
}
