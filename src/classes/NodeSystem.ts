import assert from "assert"
import type {
	INodeType,
	INodeTypeCategories,
	INodeTypeFactory
} from "../interfaces/Node.js"
import type { IPoolGetter } from "../interfaces/PoolGetter.js"
import { Enum, MapConcatenator } from "../internal/Enum.js"
import { BasicMap } from "../samples/TerminalMap.js"
import { Autocache } from "./Autocache.js"
import { BasicHash } from "./HashMap.js"
import { ObjectPool } from "./ObjectPool.js"
import { TypedPoolKeeper } from "./PoolGetter.js"

type INodeTypesMap<T = any> = Map<T, INodeType<T>>

/**
 * This is a function for wrapping an `INodeTypeFactory<T, Args>`
 * into an `Autocache` using `new BasicHash(samples.TerminalMap.BasicMap())`.
 * It allows the user to ensure that is a relatively "nice"/simple
 * `T` (number, string, etc) is used, then it will be possible
 * to recover existing `INodeType`s instead of completely
 * re-creating them. The user thus should NOT employ `instanceof`
 * as an alternative to `.is` IF `NodeFactory` [or an equivalent
 * class-caching technique] is utilized.
 */
export function NodeFactory<
	T = any,
	Args extends any[] = any[],
	K extends INodeTypeFactory<T, Args> = INodeTypeFactory<T, Args>
>(preFactory: K): K {
	return Autocache(new BasicHash(BasicMap()), preFactory) as K
}

/**
 * A class for the managing of a system of 'INodeType<T>'s.
 * A `NodeSystem` is intended to be single across an application/parser,
 * since it also manages the pools (via internal 'TypedPoolKeeper<T>'s).
 *
 * It is primarily intended to be used from within JavaScript
 * due to its poorer type granularity over the manual solution.
 *
 * It can serve as:
 *
 * 1. a way to automate the calls to `INodeTypeFactor`-ies
 * 2. a keeper of `ObjectPool`s for each of the available `INodeType`s
 * 3. a keeper of the `INodeType`s themselves [allowing access by `.type`]
 * 4. a way to extend existing 'NodeSystem's [via the `.merge` method]
 * 5. a way to check that another `NodeSystem` is a superset of the current one
 *
 * It also ensures that the `.type`s of the given `INodeTypeCategories<T>`
 * are DISJOINT [which is to say - that no two distinct `INodeTypeFactor`-ies
 * are used to produce the same type]. This, in particular, is why it is
 * highly ill-advised to create more than a single `NodeSystem` for any
 * two regions of an application that are not completely unrelated
 * [and in which reuse of types is at all probable].
 */
export class NodeSystem<T = any> {
	private readonly types: INodeTypesMap<T>
	private readonly typesSet: Set<T>
	private readonly pools = new TypedPoolKeeper<T>()

	private getExistingPoolFor(type: T) {
		return this.pools.get(type)!
	}

	private poolExistsFor(type: T) {
		return this.pools.has(type)
	}

	private getExistingByType(type: T) {
		return this.getByType(type)!
	}

	private createPoolFor(type: T) {
		return this.pools.set(
			type,
			new ObjectPool(this.getExistingByType(type))
		)
	}

	get typePools(): IPoolGetter {
		return this.pools
	}

	getByType(type: T) {
		return this.types.get(type)
	}

	has(type: T) {
		return this.types.has(type)
	}

	assertSuperset(nodeSystem: NodeSystem<T>) {
		assert(this.typesSet.isSubsetOf(nodeSystem.typesSet))
	}

	merge(system: NodeSystem<T>) {
		return new NodeSystem(this.categories.concat(system.categories))
	}

	getPool(type: T) {
		if (this.has(type)) {
			if (!this.poolExistsFor(type)) this.createPoolFor(type)
			return this.getExistingPoolFor(type)
		}
	}

	constructor(private readonly categories: INodeTypeCategories<T>) {
		const factories = categories.map(([nodeFactory]) => nodeFactory)
		const typeEnums = categories.map(([, types]) => new Enum(types))

		Enum.assertDisjoint(...typeEnums)

		this.types = MapConcatenator.concat(
			...typeEnums.map((t, i) => t.toMap(factories[i]))
		)
		this.typesSet = new Set(this.types.keys())
	}
}
