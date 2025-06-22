import { TestCounter } from "../../lib.js"
import {
	fromLinearTest,
	fromTest,
	PairsTest,
	PairsTestNumber,
	TestTypes,
	toArrayTest,
	toTest
} from "./lib.js"

namespace toArray {
	const toArrayTestCounter = new TestCounter(
		([categoryCount]: number[]) => `Pairs.toArray (#${categoryCount})`
	)

	export function test() {
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
	}
}

namespace to {
	const toTestCounter = new TestCounter(
		([categoryCount]: number[]) => `Pairs.to (#${categoryCount})`
	)

	export function test() {
		toTestCounter.test([], () => toTest([], [], []), true)

		toTestCounter.test(
			[],
			() =>
				toTest(
					["a", "b", "c"],
					[0, 1, 3],
					[
						["a", 0],
						["b", 1],
						["c", 3]
					]
				),
			true
		)

		toTestCounter.test(
			[],
			() =>
				toTest(
					[0, 1, 3],
					["a", "b", "c"],
					[
						[0, "a"],
						[1, "b"],
						[3, "c"]
					]
				),
			true
		)
	}
}

namespace from {
	const fromTestCounter = new TestCounter(
		([categoryCount]: number[]) => `Pairs.from (#${categoryCount})`
	)

	export function test() {
		fromTestCounter.test([], () => fromTest([], [[], []]), true)

		fromTestCounter.test(
			[],
			() =>
				fromTest(
					[
						["a", 0],
						["b", 1],
						["c", 2]
					],
					[
						["a", "b", "c"],
						[0, 1, 2]
					]
				),
			true
		)
	}
}

namespace fromLinear {
	const fromLinearTestCounter = new TestCounter(
		([categoryCount]: number[]) => `Pairs.fromLinear (#${categoryCount})`
	)

	export function test() {
		fromLinearTestCounter.test([], () => fromLinearTest([], []), true)

		fromLinearTestCounter.test(
			[],
			() =>
				fromLinearTest<number | string, number | string>(
					[1, "A", 3, "B", "C", "D"],
					[
						[1, "A"],
						[3, "B"],
						["C", "D"]
					]
				),
			true
		)

		fromLinearTestCounter.test(
			[],
			() =>
				fromLinearTest<number | string, number | string>(
					[1, "A", 3, "B", "C", "D", 4],
					[
						[1, "A"],
						[3, "B"],
						["C", "D"],
						[4, undefined]
					]
				),
			true
		)
	}
}

namespace Pairs {
	const pairsTestCounter = new TestCounter(
		([isNumeric, categoryCount]: number[]) =>
			`Pairs (#${isNumeric}.${categoryCount})`
	)

	export function test() {
		pairsTestCounter.test(
			[TestTypes.NUM_ARG],
			() => PairsTestNumber(0),
			true
		)
		pairsTestCounter.test(
			[TestTypes.NUM_ARG],
			() => PairsTestNumber(7),
			true
		)

		pairsTestCounter.test([TestTypes.PAIRS_ARG], () => PairsTest([]), true)
		pairsTestCounter.test(
			[TestTypes.PAIRS_ARG],
			() =>
				PairsTest<number | string, number | string>([
					[0, "A"],
					["B", 1],
					["C", "C"]
				]),
			true
		)
	}
}

toArray.test()
to.test()
from.test()
fromLinear.test()
Pairs.test()
