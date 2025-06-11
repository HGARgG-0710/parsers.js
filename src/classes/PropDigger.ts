import { type } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import assert from "assert"
import type { IPosition, IPredicatePosition } from "../interfaces.js"

const { isStruct, isArray, isNumber } = type

/**
 * This is a class for performing (repeatedly)
 * a pattern of property-access on given objects. 
 * 
 * More specifically, it accepts a vararg list of 
 * `properties[]: string` representing a sequence 
 * of properties to be accessed one after another
 * on the original object a given number of times
 * (depth: IPosition<In>). 
 * 
 * It, thus, allows passing a predicate or a finite 
 * access depth. Likewise, if it is detected that the 
 * access is being done no a non-`object` entity 
 * (excluding `null`), then the continuous access 
 * halts and this entity is returned as a result instead. 
*/
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

/**
 * A `PropDigger` over the `.resource` property. 
*/
export const resourceDigger = new PropDigger("resource")

/**
 * A `PropDigger` over the `.owner` property. 
*/
export const ownerDigger = new PropDigger("owner")
