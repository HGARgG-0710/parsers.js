import type { IInitializable } from "../interfaces.js"

class RetainedStack<Type = any> {
	private readonly stack: Type[] = []
	private size: number = 0

	private get maxSize() {
		return this.stack.length
	}

	private isFull() {
		return this.maxSize === this.size
	}

	isEmpty() {
		return this.size === 0
	}

	pop() {
		return this.stack[this.size--]
	}

	push(item: Type) {
		if (this.isFull()) this.stack.push(item)
		else this.stack[this.size] = item
		++this.size
	}
}

export class ObjectPool<
	TypeArgs extends any[] = any[],
	Type extends IInitializable<TypeArgs> = any
> {
	private readonly freeStack = new RetainedStack<Type>()

	create(...x: Partial<TypeArgs>) {
		return this.freeStack.isEmpty()
			? new this.objectConstructor(...x)
			: this.freeStack.pop().init(...x)
	}

	free(item: Type) {
		this.freeStack.push(item)
	}

	constructor(
		private readonly objectConstructor: new (
			...x: Partial<TypeArgs>
		) => Type
	) {}
}
