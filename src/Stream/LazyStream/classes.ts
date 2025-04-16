import type {
	IDirectionalPosition,
	IEndableStream,
	INavigable,
	ISource
} from "../interfaces.js"

import { streamIterator } from "../StreamClass/methods/iter.js"

import { object, type } from "@hgargg-0710/one"
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { isNumber } = type

export class LazyStream implements IEndableStream<string>, INavigable<string> {
	curr: string
	isEnd = false;

	["constructor"]: new (source: ISource) => typeof this;
	[Symbol.iterator]: () => Generator<string>

	protected nextDecoded() {
		this.source.nextChar()
	}

	protected transferDecoded() {
		return (this.curr = this.source.decoded)
	}

	isCurrEnd() {
		const isLast = !this.source.hasChars()
		if (isLast) this.source.cleanup()
		return isLast
	}

	baseNextIter() {
		this.nextDecoded()
		this.transferDecoded()
	}

	next() {
		const { curr } = this
		if (this.isCurrEnd()) this.isEnd = true
		else this.baseNextIter()
		return curr
	}

	navigate(pos: IDirectionalPosition) {
		if (isNumber(pos)) this.source.nextChar(pos)
		else while (!pos(this)) this.nextDecoded()
		return this.transferDecoded()
	}

	copy() {
		return new this.constructor(this.source.copy())
	}

	constructor(protected source: ISource) {}
}

extendPrototype(LazyStream, {
	[Symbol.iterator]: ConstDescriptor(streamIterator)
})

export * as Source from "./classes/Source.js"
