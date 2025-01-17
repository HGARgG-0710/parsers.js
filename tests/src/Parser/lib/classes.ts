import assert from "node:assert"

import type { Resulting } from "../../../../dist/src/Pattern/interfaces.js"
import type { LayeredFunction } from "../../../../dist/src/Parser/LayeredFunction/interfaces.js"
import type { Indexable } from "../../../../dist/src/IndexMap/interfaces.js"
import { classTest, signatures } from "lib/lib.js"

type GeneralParserTestSignature = {
	input: Resulting
	expectedOutput: any
	expectedResult: any
}

export function GeneralParserTest(
	className: string,
	tested: (x: Resulting) => any,
	testSignatures: GeneralParserTestSignature[]
) {
	classTest(className, () =>
		signatures(testSignatures, (signature: GeneralParserTestSignature) => () => {
			const { input, expectedOutput, expectedResult } = signature
			const output = tested(input)
			assert.strictEqual(output, expectedOutput)
			assert.strictEqual(expectedResult, input.result)
		})
	)
}

type LayeredParserTestSignature = {
	layers: Function[]
	inOuts: [any, any][]
}

export function LayeredParserTest(
	className: string,
	tested: (...input: any[]) => LayeredFunction,
	testSignatures: LayeredParserTestSignature[]
) {
	classTest(`(LayeredFunction) ${className}`, () =>
		signatures(testSignatures, ({ layers, inOuts }) => () => {
			const instance = tested(layers)
			assert.strictEqual(instance.layers, layers)
			for (const [input, output] of inOuts)
				assert.strictEqual(instance(input), output)
		})
	)
}

type TableMapTestSignature = {
	input: Indexable
	inOuts: [any, any][]
}

export function TableMapTest(
	className: string,
	tableMaker: (x: Indexable) => (x: any) => any,
	testSignatures: TableMapTestSignature[]
) {
	classTest(`(TableMap) ${className}`, () =>
		signatures(testSignatures, ({ input, inOuts }) => () => {
			const instance = tableMaker(input)
			for (const [input, output] of inOuts)
				assert.strictEqual(instance(input), output)
		})
	)
}
