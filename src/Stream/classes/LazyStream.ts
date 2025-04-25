import { type } from "@hgargg-0710/one"
import type { ISource } from "../../interfaces.js"
import type {
	IEndableStream,
	INavigable,
	IPosed,
	IPosition,
	IStream
} from "../interfaces.js"

import { GetterStream } from "./BasicStream.js"
import { uniNavigate } from "../utils.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"

const { isNumber } = type

export class LazyStream
	extends GetterStream<string>
	implements
		IEndableStream<string>,
		INavigable<string>,
		IPosed<number>,
		IOwnedStream<string>
{
	isEnd = false
	
	curr: string
	owner?: IStream<string>;

	["constructor"]: new (resource: ISource) => typeof this

	get pos() {
		return this.resource.pos
	}

	private nextDecoded(n?: number) {
		this.resource.nextChar(n)
	}

	protected currGetter() {
		return this.resource.decoded
	}

	protected baseNextIter(n?: number) {
		this.nextDecoded(n)
	}

	protected end(): void {
		this.resource.cleanup()
	}

	isCurrEnd() {
		return !this.resource.hasChars()
	}

	navigate(pos: IPosition) {
		if (isNumber(pos)) this.resource.nextChar(pos)
		else uniNavigate(this, pos)
		this.update()
		return this.curr
	}

	copy() {
		return new this.constructor(this.resource.copy())
	}

	claimBy(owner: IStream<string>): void {
		this.owner = owner
	}

	constructor(public readonly resource: ISource) {
		super()
	}
}

export * as Source from "../../Source/classes.js"
