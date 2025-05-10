import type { IStream, IInitializer } from "../../interfaces.js"

export abstract class IterableStream<Type = any> implements IStream<Type> {
	abstract isEnd: boolean
	abstract curr: Type

	abstract next(): Type
	abstract isCurrEnd(): boolean

	abstract copy(): this

	protected abstract readonly initializer?: IInitializer

	init(...x: any[]) {
		this.initializer?.init(this, ...x)
		return this
	}

	get isStream(): true {
		return true
	}

	get isLazy() {
		return false
	}

	*[Symbol.iterator]() {
		while (!this.isEnd) yield this.next()
	}
}
