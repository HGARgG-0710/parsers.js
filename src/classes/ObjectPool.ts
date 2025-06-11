import { number } from "@hgargg-0710/one"
import type { IInitializable } from "../interfaces.js"

const { max } = number

class RetainedStack<T = any> {
	private readonly stack: T[] = []
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

	push(item: T) {
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
	T extends IInitializable<TypeArgs> = any
> {
	private readonly freeStack = new RetainedStack<T>()

	private allocNew(...x: Partial<TypeArgs> | []) {
		return new this.objectConstructor(...x)
	}

	prealloc(n: number) {
		this.freeStack.ensureNew(n)
		for (let i = 0; i < n; ++i) this.freeStack.push(this.allocNew())
	}

	create(...x: [] | Partial<TypeArgs>) {
		return this.freeStack.isEmpty()
			? this.allocNew(...x)
			: this.freeStack.pop().init(...x)
	}

	free(item: T) {
		this.freeStack.push(item)
	}

	constructor(
		private readonly objectConstructor: new (
			...x: Partial<TypeArgs> | []
		) => T
	) {}
}
