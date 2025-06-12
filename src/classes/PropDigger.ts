import { type } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import assert from "assert"
import type { IPosition, IPredicatePosition } from "../interfaces.js"

const { isStruct, isArray, isNumber } = type

export class PropDigger {
	private readonly properties: string[]

	private readPropertyAt<In extends object = Summat>(x: In, index: number) {
		return x[this.properties[index]]
	}

	private loopProps<In extends object = Summat>(orig: In) {
		let currentLevel = orig
		for (let j = 0; j < this.properties.length; ++j)
			currentLevel = this.readPropertyAt(currentLevel, j)
		return currentLevel
	}

	private digFinite<In extends object = Summat, Out = any>(
		x: In,
		depth: number = 0
	) {
		let currentLevel = x
		for (let i = 0; i < depth && isStruct(currentLevel); ++i)
			currentLevel = this.loopProps(currentLevel)
		return currentLevel as unknown as Out
	}

	private digPredicate<In extends object = Summat, Out = any>(
		x: In,
		pred: IPredicatePosition<In>
	) {
		let currentLevel = x
		while (pred(x) && isStruct(currentLevel))
			currentLevel = this.loopProps(currentLevel)
		return currentLevel as unknown as Out
	}

	dig<In extends object = Summat, Out extends object = any>(
		x: In,
		depth: IPosition<In>
	) {
		return isNumber(depth)
			? this.digFinite<In, Out>(x, depth)
			: this.digPredicate<In, Out>(x, depth)
	}

	join(digger: PropDigger) {
		return new PropDigger(...this.properties, ...digger.properties)
	}

	constructor(...properties: string[]) {
		assert(isArray(properties))
		this.properties = properties
	}
}

export const resourceDigger = new PropDigger("resource")
export const ownerDigger = new PropDigger("owner")
