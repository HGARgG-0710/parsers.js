import { number } from "@hgargg-0710/one"
import type { IParseable } from "../../interfaces.js"
import type { IPosition, IStream } from "../interfaces.js"
import { isPredicatePosition } from "../Position/utils.js"
import { uniNavigate } from "../utils.js"
import { GetterStream } from "./BasicStream.js"

const { max, min } = number

export class InputStream<Type = any>
	extends GetterStream<Type>
	implements IStream<Type, [IParseable<Type>]>
{
	["constructor"]: new (resource?: IParseable<Type>) => this

	pos: number = 0
	resource?: IParseable<Type>

	private lastPos: number

	protected currGetter(): Type {
		return this.resource!.read(this.pos)
	}

	protected baseNextIter() {
		++this.pos
	}

	protected basePrevIter() {
		--this.pos
	}

	isCurrEnd(): boolean {
		return this.pos === this.resource!.size
	}

	isCurrStart(): boolean {
		return this.pos === 0
	}

	init(resource: IParseable<Type>) {
		this.lastPos = resource.size - 1
		super.init(resource)
		return this
	}

	copy() {
		return new this.constructor(this.resource?.copy())
	}

	navigate(relativePos: IPosition) {
		if (isPredicatePosition(relativePos))
			return uniNavigate(this, relativePos)

		this.pos = max(0, min(this.lastPos, this.lastPos + relativePos))
		this.update()
		return this.curr
	}

	rewind() {
		return this.navigate(0)
	}

	finish() {
		return this.navigate(this.lastPos)
	}

	constructor(resource?: IParseable<Type>) {
		super()
		if (resource) this.init(resource)
	}
}
