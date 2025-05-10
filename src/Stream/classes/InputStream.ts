import { number } from "@hgargg-0710/one"
import type { IParseable } from "../../interfaces.js"
import { ReadableView } from "../../internal/ReadableView.js"
import type { IPosition } from "../interfaces.js"
import { isPredicatePosition } from "../Position/utils.js"
import { uniNavigate } from "../utils.js"
import { GetterStream } from "./BasicStream.js"

const { max, min } = number

export class InputStream<Type = any> extends GetterStream<Type> {
	["constructor"]: new (resource?: IParseable<Type>) => this

	pos = 0

	private lastPos: number
	private readonly view: ReadableView

	protected currGetter(): Type {
		return this.resource!.read(this.pos)
	}

	protected baseNextIter() {
		++this.pos
		this.view.forward()
	}

	protected basePrevIter() {
		--this.pos
		this.view.backward()
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

	peek(n: number) {
		return this.view.read(n)
	}

	constructor(public resource?: IParseable<Type>) {
		super(resource)
		this.view = new ReadableView(0, this.resource!)
	}
}
