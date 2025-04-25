import type { IParseable } from "../../interfaces.js"
import type { IStream } from "../interfaces.js"
import { SetterStream } from "./BasicStream.js"

export class InputStream<Type = any>
	extends SetterStream<Type>
	implements IStream<Type, [IParseable<Type>]>
{
	["constructor"]: new (resource?: IParseable<Type>) => this

	pos: number = 0

	protected baseNextIter(): Type {
		return this.resource!.read(++this.pos)
	}

	protected basePrevIter(): Type {
		return this.resource!.read(--this.pos)
	}

	isCurrEnd(): boolean {
		return this.pos === this.resource!.size
	}

	isCurrStart(): boolean {
		return this.pos === 0
	}

	init(resource: IParseable<Type>) {
		this.resource = resource
		return this
	}

	copy() {
		return new this.constructor(this.resource?.copy())
	}

	constructor(public resource?: IParseable<Type>) {
		super()
	}
}
