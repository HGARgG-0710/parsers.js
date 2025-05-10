import { type } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import assert from "assert"

const { isStruct, isArray } = type

function repeat<Type = any>(array: Type[], times: number) {
	return Array.from(
		{ length: array.length * times },
		(_x, i) => array[i % array.length]
	)
}

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

	join(digger: PropDigger) {
		return new PropDigger(this.properties.concat(digger.properties))
	}

	constructor(private readonly properties: string[]) {
		assert(isArray(properties))
	}
}

export const ResourceDigger = (n: number) =>
	new PropDigger(repeat(["resource"], n))
