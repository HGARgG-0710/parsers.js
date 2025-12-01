import type {
	ICarrierNode,
	ICarrierNodeType,
	ICellNode,
	ICellNodeType,
	INode,
	IPoolNode,
	IPoolNodeType,
	IValidatable,
	IValidNodeType
} from "../../interfaces.ts"

export declare const CachedContentNode: <V = any>(
	type: IValidNodeType,
	debugName: string
) => ICarrierNodeType<V, ICarrierNode<V> & IValidatable<INode>>

/**
 * This is an `INodeTypeFactory<T, [Value | undefined]>` for creation of
 * `INode` instances with `.type` field (on prototype) defined by `type: T`
 * and a single child-node, which is reflected in tree-iteration algorithms.
 * In cases when a child is guaranteed to be the same preferable over
 * `RecursiveNode`.
 */
export declare const SingleChildNode: (
	type: IValidNodeType,
	debugName: string
) => IPoolNodeType<[INode], IPoolNode<[INode]> & IValidatable<INode>>

/**
 * This is an `INodeTypeFactory<T, [Value | undefined]>` for creation of `INode`
 * instances with `.type` field (on prototype) defined by `type: T`
 * and `.value: Value`, which is provided by the user within the
 * resulting class's constructor.
 *
 * Note: the instances of `INodeType< [Value | undefined]>`s
 * returned by `ContentNode` are poolable using the `ObjectPool`
 */
export declare const ContentNode: <Value = any>(
	type: IValidNodeType,
	debugName: string
) => ICellNodeType<Value, ICellNode<Value> & IValidatable<INode>>
