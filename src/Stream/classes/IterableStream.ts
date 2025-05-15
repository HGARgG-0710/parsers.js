import type { IInitializer, IStream } from "../../interfaces.js"

export abstract class IterableStream<Type = any> implements IStream<Type> {
	abstract isEnd: boolean
	abstract curr: Type

	abstract next(): Type
	abstract isCurrEnd(): boolean

	abstract copy(): this
	abstract init(...x: any[]): this

	*[Symbol.iterator]() {
		while (!this.isEnd) yield this.next()
	}
}

export abstract class InitStream<Type = any> extends IterableStream<Type> {
	protected abstract readonly initializer?: IInitializer

	init(...x: any[]) {
		this.initializer?.init(this, ...x)
		return this
	}

	constructor(...x: any[]) {
		super()
		this.init(...x)
	}
}
