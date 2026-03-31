import { array } from "@hgargg-0710/one"
import type {
	INode,
	ITypeCheckable,
	ITyped,
	IValidationTable,
	IValidNodeType
} from "../../interfaces.js"

/**
 * An abstract class implementing the `INode` type.
 * Recommended way to create `INode` implementations.
 *
 * Provides:
 *
 * 1. required `readonly type: T`
 * 2. various boilerplate methods
 * 3. default behaviour for the future classes:
 * 	1. .backtrack method
 *  	2. .findUnwalkedChildren
 *  	3. .lastChild == -I
 */
export abstract class BaseNode implements INode {
	abstract readonly type: IValidNodeType
	abstract readonly debugName: string
	abstract debugPrint(): string

	toJSON?(): ITyped

	private _parent: INode | null = null

	protected resetParent() {
		this._parent = null
	}

	setParent(parent: INode) {
		this._parent = parent
	}

	get parent() {
		return this._parent
	}

	index(multind: number[]) {
		if (this.lastChild < 0) return this
		const [firstIndex, ...subIndex] = multind
		return this.read(firstIndex).index(subIndex)
	}

	backtrack(positions: number) {
		let curr: INode = this
		while (--positions) curr = curr.parent!
		return curr
	}

	findUnwalkedChildren(endInd: number[]) {
		let currTree: INode = this
		let result = array.lastIndex(endInd)
		while (
			(currTree = currTree.parent!) &&
			currTree.lastChild <= endInd[result]
		)
			--result
		return result
	}

	read(i: number): INode {
		return this
	}

	get lastChild() {
		return -1
	}

	scanFor(kind: ITypeCheckable): boolean {
		if (kind.is(this)) return true
		for (const child of this) if (child.scanFor(kind)) return true
		return false
	}

	validate(table: IValidationTable<INode>): boolean {
		if (!table.validateSingle(this)) return false
		for (const child of this)
			if (
				!table.validate(this.type, child.type, child) ||
				(child.validate && !child.validate(table))
			)
				return false
		return true
	}

	*[Symbol.iterator]() {
		for (let i = 0; i <= this.lastChild; ++i) yield this.read(i)
	}

	toString() {
		return this.debugPrint()
	}
}
