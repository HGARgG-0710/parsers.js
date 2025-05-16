import { Initializable } from "../../classes/Initializer.js"
import type { IStream } from "../../interfaces.js"

export abstract class IterableStream<Type = any, Args extends any[] = any[]>
	extends Initializable<Args>
	implements IStream<Type>
{
	abstract readonly isEnd: boolean
	abstract readonly curr: Type

	abstract next(): Type
	abstract isCurrEnd(): boolean

	abstract copy(): this

	*[Symbol.iterator]() {
		while (!this.isEnd) yield this.next()
	}

	constructor(...x: Partial<Args>) {
		super()
		this.init(...x)
	}
}
