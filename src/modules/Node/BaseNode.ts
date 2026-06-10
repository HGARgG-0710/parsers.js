import { array } from "@hgargg-0710/one"
import assert from "assert"
import type {
	INode,
	ITypeCheckable,
	ITyped,
	IValidationTable,
	IValidNodeType,
	IXMLGenerationTable
} from "../../interfaces.js"
import { XMLGenerationError } from "../../objects/Error.js"
import type { NodeData } from "./NodeData.js"

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
	private _data: NodeData | null = null

	// ! pre-doc: (important) this can OPTIONALLY be used to determine how precisely
	// 		one is to render the TAG CONTENT of the node in question. If
	// 		`properTagContent` is `true`, then, THE CONVENTION IS, that contents
	// 		of said node are supposed to be FORMATTED according to XML rules (i.e. < -> &lt, ETC)
	// 		but if not, then said conventions DO NOT APPLY!
	// * very important - one can call `this.setIsProperXMLTagContent(false)` inside the constructor SO AS
	// 		to indicate said convention to the calling code.
	// ! One is not implementing a `toXMLTagContent` that honours the convention because:
	// 		1. User could still ignore it [and just use `xml.toTagContent` instead]
	// 		2. [primary reason] Performance on newline arrays.
	// 			Mapping an array of lines to be optionally converted is MUCH SLOWER
	// 			than simply skipping the whole allocation + calling steps altogether
	// 			by exposing said property
	protected isProperXMLTagContent: boolean = true

	protected resetParent() {
		this._parent = null
	}

	setIsProperXMLTagContent(isIt: boolean) {
		this.isProperXMLTagContent = isIt
	}

	setParent(parent: INode) {
		this._parent = parent
	}

	get parent() {
		return this._parent
	}

	setData(newData: NodeData): void {
		this._data = newData
	}

	get data() {
		assert(this._data)
		return this._data
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

	toXML(table: IXMLGenerationTable): string[] {
		throw new XMLGenerationError(this)
	}
}
