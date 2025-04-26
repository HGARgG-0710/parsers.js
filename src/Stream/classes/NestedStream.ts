import { type } from "@hgargg-0710/one"
import type { ILookupTable, IStreamPredicate } from "../../interfaces.js"
import { finish } from "../utils.js"
import { WrapperStream } from "./WrapperStream.js"
import type {
	INestedElement,
	IUnderNestedStream,
	INestedStream
} from "../interfaces/NestedStream.js"

const { isUndefined, isNull } = type

export function NestedStream<Type = any, IndexType = any>(
	typesTable: ILookupTable<
		any,
		IStreamPredicate<INestedElement<Type>>,
		IndexType
	>
): new (resource: IUnderNestedStream<Type>) => INestedStream<Type, IndexType> {
	class nestedStream
		extends WrapperStream
		implements INestedStream<Type, IndexType>
	{
		currNested: boolean
		assignedIndex: IndexType

		private _isEnd: boolean
		private _isStart: boolean
		private _curr: INestedElement<Type, IndexType>

		set isStart(newIsStart: boolean) {
			this._isStart = newIsStart
		}

		get isStart() {
			return this._isStart
		}

		set isEnd(newIsEnd: boolean) {
			this._isEnd = newIsEnd
		}

		get isEnd() {
			return this._isEnd
		}

		set curr(newCurr: Type | INestedStream<Type, IndexType>) {
			this._curr = newCurr
		}

		get curr() {
			const localCurr = this._curr
			return isUndefined(localCurr) ? this.underCurr() : localCurr
		}

		private underCurr() {
			return this.resource!.curr
		}

		private currGetter() {
			const index = typesTable.claim(this)
			return (this.currNested = !isNull(index))
				? new this.constructor(this.resource!).setIndex(index)
				: this.underCurr()
		}

		private initGetter() {
			return this.currGetter()
		}

		private baseNextIter() {
			if (this.currNested)
				finish(this.curr as INestedStream<Type, IndexType>)
			this.resource!.next()
			this.curr = this.currGetter()
		}

		isCurrEnd(): boolean {
			return (
				this.resource!.isCurrEnd!() ||
				(typesTable.isOwned(this) && typesTable.byOwned(this)(this))
			)
		}

		next() {
			const curr = this.curr
			this.isStart = false
			if (this.isCurrEnd()) this.isEnd = true
			else this.baseNextIter()
			return curr
		}

		init(resource: IUnderNestedStream<Type>) {
			super.init(resource)
			this.curr = this.initGetter()
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

		constructor(resource: IUnderNestedStream<Type>) {
			super(resource)
		}
	}

	return nestedStream
}
