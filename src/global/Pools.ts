import {
	JointPoolCollection,
	PoolCollection
} from "../objects/PoolCollection.js"

/**
 * This is a `PoolCollection` designated for `ObjectPool`s
 * for `ILinkedStream`-creating classes. Those are the only
 * `IStream` instances that are pooled and that need freeing.
 *
 * If the user creates their own `ILinkedStream`s that have
 * a pool (i.e. a non-empty `free` method, such as when mixing in
 * `PoolableStream`), it is recommended they add the pool to
 * `Pools.Streaam` via calling `Pools.Stream.add(userPool)`.
 */
export const Stream = new PoolCollection()

/**
 * This is a `PoolCollection` designated for `ObjectPool`s
 * for `INode`-creating classes. Those, unlike other pools,
 * are strictly optional since many applications of the
 * library require that the nodes remain persistent instead
 * of being temporary. (Cases when it is not so imply performing
 * the entire app logic within the constraints of `DynamicParser`,
 * assuming it is used).
 */
export const Node = new PoolCollection()

/**
 * This is a `PoolCollection` designated for `ObjectPool`s
 * of varying types that cannot be categorized via any other
 * `PoolCollection`s of the library's `Pools` submodule.
 *
 * It is only to be `clear()`ed (same as the other `Pool`s)
 * after parsing logic has been completed - at the end of
 * the top-level parsing function. Doing otherwise will
 * lead to strange behaviour.
 */
export const Internal = new PoolCollection()

/**
 * This is a `JointPoolCollection` for representing
 * all the `PoolCollection`s of the `Pools` submodule.
 * It is recommended that the user call `Pools.All.free()`
 * instead of enumerating each pool
 */
export const All = new JointPoolCollection(Stream, Node, Internal)
