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
export const hasChildren = <T extends IWalkable<T> = any>(x: IWalkable<T>) =>
	isGoodIndex(x.lastChild)

/**
 * Sequentially indexes a given `node` using `multind` for indicies array.
 * Provided correctness, results are stored in an array of `multind.length` length and then returned.
 */
export function sequentialIndex<T extends IWalkable<T> = any>(
	node: IWalkable<T>,
	multind: number[]
) {
	const result: IWalkable<T>[] = [node].concat(new Array(multind.length))
	for (let i = 0; i < multind.length; ++i)
		result[i + 1] = result[i].read(multind[i])
	return result
}

/**
 * Returns the multi-index (`number[]`) for the deep-rightmost (recursive-last)
 * element of the given `IWalkable`
 */
export function treeEndPath<T extends IWalkable<T> = any>(node: IWalkable<T>) {
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
export const isType = <T = any>(_type: T): ((x: ITyped) => boolean) =>
	trivialCompose(eqcurry(_type), type)

export function fromObject<T = any>(allowedTypes: NodeSystem<T>) {
	function isValid(type: T): boolean {
		return allowedTypes.has(type)
	}

	return function deserializer(from: any) {
		if (!isTyped(from)) return false
		if (!isValid(from.type)) return false
		return allowedTypes.getByType(from.type)!.fromPlain(from, deserializer)
	}
}
