import type { Summat } from "@hgargg-0710/summat.ts"
import { array } from "@hgargg-0710/one"
const { propPreserve } = array
import { RecursiveArrayTree } from "./classes.js"
import type { Tree, InTreeType } from "./interfaces.js"

const mapPropsPreserve = (
	f: (x?: any, i?: number, arr?: any[]) => any
): ((x: any[] & Summat) => any[] & Summat) => propPreserve((array: any[]) => array.map(f))

export const arrayTreePreserve = mapPropsPreserve(RecursiveArrayTree)

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
