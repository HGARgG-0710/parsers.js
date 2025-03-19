import assert from "node:assert"

import type {
	IComposition,
	IIndexable
} from "../../../../dist/src/interfaces.js"

import { classTest, signatures } from "lib/lib.js"

type LayeredParserTestSignature = {
	layers: Function[]
	inOuts: [any, any][]
}

export function CompositionTest(
	className: string,
	Tested: new (...input: any[]) => IComposition,
	testSignatures: LayeredParserTestSignature[]
) {
	classTest(`(LayeredFunction) ${className}`, () =>
		signatures(testSignatures, ({ layers, inOuts }) => () => {
			const instance = new Tested(layers)
			assert.strictEqual(instance.layers, layers)
			for (const [input, output] of inOuts)
				assert.strictEqual(instance(input), output)
		})
	)
}

type TableMapTestSignature = {
	input: IIndexable
	inOuts: [any, any][]
}

export function TableMapTest(
	className: string,
	tableMaker: (x: IIndexable) => (x: any) => any,
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
