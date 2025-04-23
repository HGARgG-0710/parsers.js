import type { Summat } from "@hgargg-0710/summat.ts"
import { type } from "@hgargg-0710/one"
import assert from "assert"

const { isStruct, isArray } = type

export class PropDigger {
	dig<In extends object = Summat, Out extends object = any>(
		x: In,
		depth: number = 0
	) {
		let currentLevel = x
		for (let i = 0; i < depth && isStruct(currentLevel); ++i)
			currentLevel = currentLevel[this.properties[i]]
		return currentLevel as unknown as Out
	}

	constructor(private readonly properties: string[]) {
		assert(isArray(properties))
	}
}
