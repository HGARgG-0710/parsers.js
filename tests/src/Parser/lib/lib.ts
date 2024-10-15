import { describe } from "node:test"
import type { Resulting } from "../../../../dist/src/Pattern/interfaces.js"
import assert from "node:assert"
import type { LayeredParser } from "../../../../dist/src/Parser/LayeredParser/interfaces.js"
import type { Indexable } from "../../../../dist/src/IndexMap/interfaces.js"

type GeneralParserTestSignature = {
	input: Resulting
	expectedOutput: any
	expectedResult: any
}

export function GeneralParserTest(
	className: string,
	tested: (x: Resulting) => any,
	signatures: GeneralParserTestSignature[]
) {
	describe(`class: (GeneralParser) ${className}`, () => {
		for (const signature of signatures) {
			const { input, expectedOutput, expectedResult } = signature
			const output = tested(input)
			assert.strictEqual(output, expectedOutput)
			assert.strictEqual(expectedResult, input.result)
		}
	})
}

type LayeredParserTestSignature = {
	layers: Function[]
	inOuts: [any, any][]
}

export function LayeredParserTest(
	className: string,
	tested: (...input: any[]) => LayeredParser,
	signatures: LayeredParserTestSignature[]
) {
	describe(`class: (LayeredParser) ${className}`, () => {
		for (const signature of signatures) {
			const { layers, inOuts } = signature
			const instance = tested(layers)
			assert.strictEqual(instance.layers, layers)
			for (const [input, output] of inOuts)
				assert.strictEqual(instance(input), output)
		}
	})
}

type TableMapTestSignature = {
	input: Indexable
	inOuts: [any, any][]
}

export function TableMapTest(
	className: string,
	tableMaker: (x: Indexable) => (x: any) => any,
	signatures: TableMapTestSignature[]
) {
	describe(`class: (TableMap) ${className}`, () => {
		for (const signature of signatures) {
			const { input, inOuts } = signature
			const instance = tableMaker(input)
			for (const [input, output] of inOuts)
				assert.strictEqual(instance(input), output)
		}
	})
}
