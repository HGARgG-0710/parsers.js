import type { IStream } from "../interfaces.js"

export abstract class BasicStream<Type = any> implements IStream<Type> {
	protected abstract baseNextIter(): Type
	protected abstract update(newCurr?: Type): void

	protected end?(): void
	protected basePrevIter?(): Type
	protected start?(): void

	abstract isCurrEnd(): boolean
	abstract copy(): this

	isCurrStart?(): boolean

	isStart: boolean = true
	isEnd: boolean = false
	curr: Type

	next() {
		const curr = this.curr
		this.isStart = false
		if (this.isEnd || this.isCurrEnd()) {
			this.isEnd = true
			this.end?.()
		} else this.update(this.baseNextIter())
		return curr
	}

	prev() {
		const curr = this.curr
		this.isEnd = false
		if (this.isStart || this.isCurrStart!()) {
			this.isStart = true
			this.start?.()
		} else this.update(this.basePrevIter!())
		return curr
	}

	*[Symbol.iterator]() {
		while (!this.isEnd) yield this.next()
	}
}

export abstract class GetterStream<Type = any> extends BasicStream<Type> {
	protected abstract currGetter(): Type

	protected update(newCurr?: Type) {
		this.curr = this.currGetter()
	}
}

export abstract class SetterStream<Type = any> extends BasicStream<Type> {
	protected update(newCurr: Type) {
		this.curr = newCurr
	}
}
