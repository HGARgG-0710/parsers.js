import { TestCounter } from "../../lib.js"
import { toArrayTest } from "./lib.js"

const toArrayTestCounter = new TestCounter(
	([categoryCount]: number[]) => `Pairs.toArray (#${categoryCount})`
)

toArrayTestCounter.test([], () => toArrayTest([], []), true)

toArrayTestCounter.test(
	[],
	() =>
		toArrayTest(
			[
				[0, "A"],
				[1, "B"],
				[2, "C"],
				[3, "D"]
			],
			["A", "B", "C", "D"]
		),
	true
)

toArrayTestCounter.test(
	[],
	() =>
		toArrayTest(
			[
				[1, "A"],
				[3, "B"],
				[4, "C"]
			],
			[undefined, "A", undefined, "B", "C"]
		),
	true
)
