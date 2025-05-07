import type { IStream } from "../interfaces.js"

export abstract class IterableStream<Type = any> implements IStream<Type> {
	abstract isEnd: boolean
	abstract curr: Type

	abstract next(): Type
	abstract isCurrEnd(): boolean

	abstract copy(): this
	abstract init(...x: any[]): this

	get isStream(): true {
		return true
	}

	get isLazy() {
		return false
	}

	*[Symbol.iterator]() {
		while (!this.isEnd) yield this.next()
	}

	constructor(resource?: unknown) {
		if (resource) this.init(resource)
	}
}
