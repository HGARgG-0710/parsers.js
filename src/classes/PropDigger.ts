import { type } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import assert from "assert"

const { isStruct, isArray } = type

export class PropDigger {
	private readonly properties: string[]

	dig<In extends object = Summat, Out extends object = any>(
		x: In,
		depth: number = 0
	) {
		let currentLevel = x
		outer: for (let i = 0; i < depth; ++i)
			for (let j = 0; j < this.properties.length; ++j) {
				if (!isStruct(currentLevel)) break outer
				currentLevel = currentLevel[this.properties[j]]
			}
		return currentLevel as unknown as Out
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
