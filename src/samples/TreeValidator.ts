import type { INode, IValidNodeType } from "../interfaces.js"
import type { DepthStream } from "../objects/Stream.js"

/**
 * This is a function for creation of primitive Tree-Structure validators.
 * It works with a `DepthStream<INode>` object, and relies on this
 * assumption heavily. The `validNodeTypes` is an `Iterable` of pairs
 * of `[T, Iterable<T>]`, where first item in the pair (parent node
 * `.type` value) is used to get the second - an `Iterable` of
 * acceptable `T` values of `.type` property of children.
 *
 * If a type of a parent is missing from the map as the "key" `T`,
 * it will not be validated, and instead skipped, however, its
 * children may not necessarily be, if they themselves are present.
 *
 * Thus, by applying the `validNodeTypes` recursively to the given
 * `treeStream`, one is able to deduce whether the tree structure is
 * as expected.
 *
 * Note again that the validator in question is *primitive* and
 * (in complex languages) is intended to be used in combination
 * with lexical analysis for tree-modification after the initial parsing.
 */
export function TreeValidator(
	validNodeTypes: Iterable<[IValidNodeType, Iterable<IValidNodeType>]>
) {
	const validTypesAsMap = new Map(
		[...validNodeTypes].map(([parentType, childrenTypes]) => [
			parentType,
			new Set(childrenTypes)
		])
	)

	function validator(treeStream: DepthStream<INode>) {
		const failure = TreeValidator.ValidationStatus.failure(treeStream)
		const success = TreeValidator.ValidationStatus.success(treeStream)

		function skipUnvalidatedParent(currParent: INode) {
			for (let i = 0; i <= currParent.lastChild; ++i) {
				treeStream.next()
				const currValidated = tryValidatingParent()
				if (!currValidated.isSuccess) return currValidated
			}
			return success
		}

		function validateChildren(
			currParent: INode,
			allowedTypes: Set<IValidNodeType>
		) {
			for (let i = 0; i <= currParent.lastChild; ++i) {
				treeStream.next()
				const currChild = treeStream.curr
				if (!allowedTypes.has(currChild.type)) return failure
				const subValidation = tryValidatingParent()
				if (!subValidation.isSuccess) return subValidation
			}
			return success
		}

		function tryValidatingParent(): TreeValidator.ValidationStatus {
			while (!treeStream.isEnd) {
				const currParent = treeStream.curr
				const allowedTypes = validTypesAsMap.get(currParent.type)
				const childValidation = allowedTypes
					? validateChildren(currParent, allowedTypes)
					: skipUnvalidatedParent(currParent)
				if (!childValidation.isSuccess) return childValidation
			}
			return success
		}

		return tryValidatingParent()
	}

	return validator
}

export namespace TreeValidator {
	/**
	 * This is a class for representing a status of validation of a given
	 * tree via the function returned by `TreeValidator`.
	 *
	 * Contains the `readonly .isSuccess: bool` property for identifying
	 * whether the validation has been successful. It also carries a
	 * `readonly targetStream: DepthStream<INode>` property for
	 */
	export class ValidationStatus {
		static success(targetStream: DepthStream<INode>) {
			return new ValidationStatus(true, targetStream)
		}

		static failure<T = any>(targetStream: DepthStream<INode>) {
			return new ValidationStatus(false, targetStream)
		}

		constructor(
			readonly isSuccess: boolean,
			readonly targetStream: DepthStream<INode>
		) {}
	}
}
