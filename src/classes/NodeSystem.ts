import assert from "assert"
import { MapInternal } from "../HashMap/classes/PreMap.js"
import { Autocache } from "../internal/Autocache.js"
import { Enum, MapConcatenator } from "../internal/Enum.js"
import { BasicHash } from "./HashMap.js"
import { ObjectPool } from "./ObjectPool.js"
import type {
	INodeTypeFactory,
	INodeTypesMap,
	INodeTypeCategories
} from "../interfaces/Node.js"
import { TypedPoolKeeper } from "./PoolGetter.js"
import type { IPoolGetter } from "../interfaces/PoolGetter.js"

export function NodeFactory<T = any>(
	preFactory: INodeTypeFactory<T>
): INodeTypeFactory<T> {
	return Autocache(new BasicHash(new MapInternal()), preFactory)
}

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

	getCategory(i: number) {
		return this.categories[i]
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
