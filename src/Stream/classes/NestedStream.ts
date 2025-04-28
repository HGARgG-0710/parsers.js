import { type } from "@hgargg-0710/one"
import type {
	ILookupTable,
	IOwnedStream,
	IStreamPredicate
} from "../../interfaces.js"
import type {
	INestedElement,
	INestedStream
} from "../interfaces/NestedStream.js"
import { finish } from "../utils.js"
import { DyssyncStream } from "./WrapperStream.js"

const { isNull } = type

export function NestedStream<Type = any, IndexType = any>(
	typesTable: ILookupTable<
		any,
		IStreamPredicate<INestedElement<Type>>,
		IndexType
	>
): new (resource: IOwnedStream<Type>) => INestedStream<Type, IndexType> {
	return class
		extends DyssyncStream<INestedElement<Type, IndexType>>
		implements INestedStream<Type, IndexType>
	{
		currNested: boolean
		assignedIndex: IndexType

		private underCurr() {
			return this.resource!.curr
		}

		private currGetter() {
			const index = typesTable.claim(this)
			return (this.currNested = !isNull(index))
				? new this.constructor(this.resource!).setIndex(index)
				: this.underCurr()
		}

		private baseNextIter() {
			if (this.currNested)
				finish(this.curr as INestedStream<Type, IndexType>)
			this.resource!.next()
			this.curr = this.currGetter()
		}

		isCurrEnd(): boolean {
			return (
				this.resource!.isCurrEnd() ||
				(typesTable.isOwned(this) && typesTable.byOwned(this)(this))
			)
		}

		next() {
			const curr = this.curr
			this.isStart = false
			if (this.isCurrEnd()) this.endStream()
			else this.baseNextIter()
			return curr
		}

		init(resource: IOwnedStream<Type>) {
			super.init(resource)
			this.curr = this.currGetter()
			return this
		}

		setIndex(index: IndexType) {
			this.assignedIndex = index
			return this
		}

		copy() {
			const copied = super.copy()
			copied.setIndex(this.assignedIndex)
			return copied
		}
	}
}
