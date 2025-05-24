import { ArrayStream } from "./ArrayStream.js"

export class LoopStream<Type = any> extends ArrayStream<Type, Type> {
	["constructor"]: new (...loop: Type[]) => this

	private index: number = 0

	private wrapped(index: number) {
		return (this.index = index % this.items.length)
	}

	protected baseNextIter(): Type {
		return this.items[this.wrapped(this.index + 1)]
	}

	isCurrEnd(): boolean {
		return false
	}
}
