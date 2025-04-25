import { type } from "@hgargg-0710/one"
import assert from "assert"
import type { IUnfreezableSequence } from "./interfaces.js"
import { TypicalUnfreezable } from "../../internal/Collection/Sequence/TypicalUnfreezable.js"

const { isString } = type

export class SourceBuilder
	extends TypicalUnfreezable<string>
	implements IUnfreezableSequence<string>
{
	protected collection: string

	get() {
		return super.get() as string
	}

	push(...strings: string[]) {
		if (!this.isFrozen) this.collection += strings.join("")
		return this
	}

	constructor(value: string = "") {
		assert(isString(value))
		super(value)
	}
}
