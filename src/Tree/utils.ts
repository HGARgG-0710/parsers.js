import type { Tree, InTreeType } from "./interfaces.js"

export function sequentialIndex<Type = any>(
	tree: Tree<Type>,
	multind: number[]
): InTreeType<Type>[] {
	const result: InTreeType<Type>[] = [tree]
	let current: InTreeType<Type> = tree
	for (const index of multind)
		result.push((current = (current as Tree<Type>).index([index])))
	return result
}
