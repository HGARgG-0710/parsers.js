import { type as _type, boolean, functional, object } from "@hgargg-0710/one"
import { fromEnum, isGoodIndex } from "../utils.js"
import { ContentNode, RecursiveNode, TokenNode } from "../classes/Node.js"
import type {
	IChildrenHaving,
	ITypeCheckable,
	ITyped,
	IValued,
	IWalkable
} from "../interfaces/Node.js"
import type { Enum } from "../classes.js"
import type { NodeSystem } from "../classes/NodeSystem.js"

const { prop, structCheck } = object
const { trivialCompose } = functional
const { eqcurry, T } = boolean
const { isArray } = _type

export const isTyped = structCheck<ITyped>(["type"])

export const isContentNodeSerializable = structCheck<ITyped & IValued>([
	"type",
	"value"
])

export const isRecursiveNodeSerializable = structCheck<
	ITyped & IChildrenHaving
>({
	type: T,
	children: isArray
})

/**
 * Returns `TokenNode`s with `.type`s defined by the elements of the
 * given `IEnumSpace`
 */
export const tokenNodes = fromEnum(TokenNode)

/**
 * Returns `ContentNode`s with `.type`s defined by the elements of the
 * given `IEnumSpace`
 */
export const contentNodes = fromEnum(ContentNode)

/**
 * Returns `RecursiveNode`s with `.type`s defined by the elements of the
 * given `IEnumSpace`
 */
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
 * Returns the value of the `x.type` for the given `ITyped`
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
