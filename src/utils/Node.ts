import { boolean, functional } from "@hgargg-0710/one"
import { type } from "../aliases/Node.js"
import type { NodeSystem } from "../classes/NodeSystem.js"
import type { ITyped, IWalkable } from "../interfaces/Node.js"
import { isTyped } from "../is/Node.js"
import { isGoodIndex } from "../utils.js"

const { trivialCompose } = functional
const { eqcurry } = boolean

/**
 * Returns whether the given `x` has at least 1 child
 */
export const hasChildren = <Type extends IWalkable<Type> = any>(
	x: IWalkable<Type>
) => isGoodIndex(x.lastChild)

/**
 * Sequentially indexes a given `node` using `multind` for indicies array.
 * Provided correctness, results are stored in an array of `multind.length` length and then returned.
 */
export function sequentialIndex<Type extends IWalkable<Type> = any>(
	node: IWalkable<Type>,
	multind: number[]
) {
	const result: IWalkable<Type>[] = [node].concat(new Array(multind.length))
	for (let i = 0; i < multind.length; ++i)
		result[i + 1] = result[i].read(multind[i])
	return result
}

/**
 * Returns the multi-index (`number[]`) for the deep-rightmost (recursive-last)
 * element of the given `IWalkable`
 */
export function treeEndPath<Type extends IWalkable<Type> = any>(
	node: IWalkable<Type>
) {
	const lastIndex: number[] = []
	let current = node
	while (hasChildren(current)) {
		const { lastChild } = current
		lastIndex.push(lastChild)
		current = current.read(lastChild)
	}
	return lastIndex
}

/**
 * Returns the predicate for checking that the `.type` property of the given
 * `ITyped` is equal to `type`
 */
export const isType = <Type = any>(
	_type: Type
): (<Type = any>(x: ITyped<Type>) => boolean) =>
	trivialCompose(eqcurry(_type), type)

export function fromObject<Type = any>(allowedTypes: NodeSystem<Type>) {
	function isValid(type: Type): boolean {
		return allowedTypes.has(type)
	}

	return function deserializer(from: any) {
		if (!isTyped(from)) return false
		if (!isValid(from.type)) return false
		return allowedTypes
			.getByType(from.type)!
			.deserialize(from, deserializer)
	}
}
