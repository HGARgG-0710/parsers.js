import assert from "assert"
import type {
	INodeType,
	INodeTypeCategories,
	INodeTypeFactory,
	IValidNodeType
} from "../interfaces/Node.js"
import { Enum, MapConcatenator } from "../internal/Enum.js"
import { BasicMap } from "../samples/TerminalMap.js"
import { Autocache } from "./Autocache.js"
import { BasicHash } from "./HashMap.js"

type INodeTypesMap = Map<IValidNodeType, INodeType>

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
	Args extends any[] = any[],
	K extends INodeTypeFactory<Args> = INodeTypeFactory<Args>
>(preFactory: K): K {
	return Autocache(new BasicHash(BasicMap()), preFactory) as K
}

/**
 * A class for the managing of a system of 'INodeType<T>'s.
 * A `NodeSystem` is intended to represent a list of "keys",
 * defining the types of nodes, which are deemed valid.
 *
 * It is primarily intended to be used within JavaScript code
 * and not TypeScript due to poorer type granularity.
 *
 * It can serve as:
 *
 * 1. a way to automate the calls to `INodeTypeFactor`-ies
 * 2. a keeper of the `INodeType`s themselves [allowing access by `.type`]
 * 3. a way to extend existing 'NodeSystem's [via the `.merge` method]
 * 4. a way to check that another `NodeSystem` is a superset of the current one
 *
 * It also ensures that the `.type`s of the given `INodeTypeCategories<T>`
 * are DISJOINT [which is to say - that no two distinct `INodeTypeFactor`-ies
 * are used to produce the same type]. This, in particular, is why it is
 * highly ill-advised to create more than a single `NodeSystem` for any
 * two regions of an application that are not completely unrelated
 * [and in which reuse of types is at all probable].
 */
export class NodeSystem {
	private readonly types: INodeTypesMap
	private readonly typesSet: Set<IValidNodeType>

	getByType(type: IValidNodeType) {
		return this.types.get(type)
	}

	has(type: IValidNodeType) {
		return this.types.has(type)
	}

	assertSuperset(nodeSystem: NodeSystem) {
		assert(this.typesSet.isSubsetOf(nodeSystem.typesSet))
	}

	merge(system: NodeSystem) {
		return new NodeSystem(this.categories.concat(system.categories))
	}

	constructor(private readonly categories: INodeTypeCategories) {
		const factories = categories.map(([nodeFactory]) => nodeFactory)
		const typeEnums = categories.map(([, types]) => new Enum(types))

		Enum.assertDisjoint(...typeEnums)

		this.types = MapConcatenator.concat(
			...typeEnums.map((t, i) => t.toMap(factories[i]))
		)
		this.typesSet = new Set(this.types.keys())
	}
}
