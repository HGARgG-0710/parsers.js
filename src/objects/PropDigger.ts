import { boolean, type } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { IPosition, IPredicatePosition } from "../interfaces.js"

const { isStruct, isNumber } = type
const { T } = boolean

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
	public readonly properties: string[]

	private predicate: IPredicatePosition<any> = T

	private withPredicate<In extends Summat = object, T = any>(
		newPred: IPredicatePosition<In>,
		callback: () => T
	) {
		this.predicate = newPred
		const retval: T = callback.call(this)
		this.predicate = T
		return retval
	}

	private get loopSize() {
		return this.properties.length
	}

	private readPropertyAt<In extends object = Summat>(x: In, index: number) {
		return x[this.properties[index]]
	}

	private loopProps<In extends object = Summat>(orig: In) {
		let currentLevel = orig
		for (
			let j = 0;
			j < this.loopSize &&
			isStruct(currentLevel) &&
			this.predicate(currentLevel, j);
			++j
		)
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
		return this.withPredicate(pred, () =>
			this.digPredicateAware<In, Out>(x)
		)
	}

	private digPredicateAware<In extends object = Summat, Out = any>(x: In) {
		let currentLevel = x
		while (isStruct(currentLevel) && this.predicate(currentLevel))
			currentLevel = this.loopProps(currentLevel)
		return currentLevel as unknown as Out
	}

	dig<In extends object = Summat, Out = any>(x: In, depth: IPosition<In>) {
		return isNumber(depth)
			? this.digFinite<In, Out>(x, depth)
			: this.digPredicate<In, Out>(x, depth)
	}

	with(...newProperties: string[]) {
		return new PropDigger(...this.properties, ...newProperties)
	}

	copy() {
		return new PropDigger(...this.properties)
	}

	constructor(...properties: string[]) {
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
