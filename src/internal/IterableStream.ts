import type { IStream } from "../interfaces.js"

export abstract class IterableStream<Type = any> implements IStream<Type> {
	abstract isEnd: boolean
	abstract curr: Type

	abstract copy(): this
	abstract next(): Type
	abstract isCurrEnd(): boolean

	*[Symbol.iterator]() {
		while (!this.isEnd) yield this.next()
	}
}
