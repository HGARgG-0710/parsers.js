import { object, type } from "@hgargg-0710/one"
import type {
	IDirectionalPosition,
	IEndableStream,
	IIsEndCurrable,
	INavigable,
	ISource
} from "../interfaces.js"
import { streamIterator } from "../StreamClass/methods/iter.js"

const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { isNumber } = type

export class LazyStream
	implements IEndableStream<string>, INavigable<string>, IIsEndCurrable
{
	curr: string
	isEnd = false;

	["constructor"]: new (source: ISource) => typeof this;
	[Symbol.iterator]: () => Generator<string>

	private nextDecoded() {
		this.source.nextChar()
	}

	private transferDecoded() {
		return (this.curr = this.source.decoded)
	}

	private baseNextIter() {
		this.nextDecoded()
		this.transferDecoded()
	}

	isCurrEnd() {
		return !this.source.hasChars()
	}

	next() {
		const { curr } = this
		if (this.isCurrEnd()) {
			this.isEnd = true
			this.source.cleanup()
		} else this.baseNextIter()
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
