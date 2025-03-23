import type { ITypeCheckable } from "./interfaces.js"
import type { ITyped, IWalkable } from "./interfaces.js"

import { fromEnum } from "../EnumSpace/utils.js"
import { isGoodIndex } from "../utils.js"
import { ContentNode, RecursiveNode, TokenNode } from "./classes.js"

import { object, type as _type, functional, boolean } from "@hgargg-0710/one"
const { prop } = object
const { trivialCompose } = functional
const { eqcurry } = boolean

export const tokenNodes = fromEnum(TokenNode)
export const contentNodes = fromEnum(ContentNode)
export const recursiveNodes = fromEnum(RecursiveNode)

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
 * Returns the multi-index (`number[]`) for the rightmost (recursive-last)
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
 * Returns the value of the `x.type` for the given `ITokenInstance`
 */
export const type = prop("type") as <Type = any>(x: ITyped<Type>) => Type

/**
 * Returns the value of the `.is` property for the given `TypeCheckable`
 */
export const is = prop("is") as <Type = any>(
	t: ITypeCheckable
) => _type.TypePredicate<Type>

/**
 * Returns the predicate for checking that the `.type` property of the given
 * `ITyped` is equal to `type`
 */
export const isType = <Type = any>(_type: Type) =>
	trivialCompose(eqcurry(_type), type) as <Type = any>(
		x: ITyped<Type>
	) => boolean
