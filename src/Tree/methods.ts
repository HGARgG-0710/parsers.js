import type { ChildrentTree } from "./interfaces.js"

export function childIndex<Type = any>(this: ChildrentTree<Type>, multind: number[]) {
	return multind.reduce(
		(prev, curr) => (prev.children as ChildrentTree<Type>[])[curr],
		this
	)
}

export function childrenCount(this: ChildrentTree): number {
	return this.children.length - 1
}
