import type { IInitializable } from "../interfaces.js"
import { number } from "@hgargg-0710/one"

const { max } = number

class RetainedStack<Type = any> {
	private readonly stack: Type[] = []
	private usedSize: number = 0

	private set maxSize(newMaxSize: number) {
		this.stack.length = newMaxSize
	}

	private get maxSize() {
		return this.stack.length
	}

	private isFull() {
		return this.freeSpace === 0
	}

	private get freeSpace() {
		return this.maxSize - this.usedSize
	}

	isEmpty() {
		return this.usedSize === 0
	}

	pop() {
		return this.stack[this.usedSize--]
	}

	push(item: Type) {
		if (this.isFull()) this.stack.push(item)
		else this.stack[this.usedSize] = item
		++this.usedSize
	}

	ensureNew(n: number) {
		this.maxSize += max(0, n - this.freeSpace)
	}
}

export class ObjectPool<
	TypeArgs extends any[] = any[],
	Type extends IInitializable<TypeArgs> = any
> {
	private readonly freeStack = new RetainedStack<Type>()

	private allocNew(...x: Partial<TypeArgs> | []) {
		return new this.objectConstructor(...x)
	}

	prealloc(n: number) {
		this.freeStack.ensureNew(n)
		for (let i = 0; i < n; ++i) this.freeStack.push(this.allocNew())
	}

	create(...x: Partial<TypeArgs>) {
		return this.freeStack.isEmpty()
			? this.allocNew(...x)
			: this.freeStack.pop().init(...x)
	}

	free(item: Type) {
		this.freeStack.push(item)
	}

	constructor(
		private readonly objectConstructor: new (
			...x: Partial<TypeArgs> | []
		) => Type
	) {}
}
