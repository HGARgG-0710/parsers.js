import type { IEndableStream, ISource } from "../interfaces.js"

import { streamIterator } from "../StreamClass/methods/iter.js"

import { object } from "@hgargg-0710/one"
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor

export class LazyStream implements IEndableStream<string> {
	curr: string
	isEnd: boolean = false;

	["constructor"]: new (source: ISource) => typeof this;
	[Symbol.iterator]: () => Generator<string>

	isCurrEnd() {
		const isLast = !this.source.hasChars()
		if (isLast) this.source.cleanup()
		return isLast
	}

	baseNextIter() {
		this.source.nextChar()
		this.curr = this.source.decoded
	}

	next() {
		const { curr } = this
		if (this.isCurrEnd()) this.isEnd = true
		else this.baseNextIter()
		return curr
	}

	copy() {
		return new this.constructor(this.source.copy())
	}

	constructor(protected source: ISource) {}
}

extendPrototype(LazyStream, {
	[Symbol.iterator]: ConstDescriptor(streamIterator)
})

export * as Source from "./Source.js"
