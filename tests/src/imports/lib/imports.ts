import assert from "node:assert"
import { typeof as type } from "@hgargg-0710/one"
const { isObject, isFunction } = type

export function importTest(importsList: [string, (x: any) => boolean][]) {
	return function (module: object) {
		for (const [importName, importType] of importsList)
			assert(importName in module && importType(module[importName]))

		const importsNum = importsList.length
		assert.strictEqual(new Set(importsList.map((x) => x[0])).size, importsNum)
		assert.strictEqual(Object.keys(module).length, importsNum)
	}
}

export const objectImports = ((...strings: string[]) =>
	strings.map((x) => [x, isObject])) as (
	...strings: string[]
) => [string, (x: any) => boolean][]

export const functionImports = ((...strings: string[]) =>
	strings.map((x) => [x, isFunction])) as (
	...strings: string[]
) => [string, (x: any) => boolean][]

export const topLevelImports = importTest(
	objectImports("IndexMap", "Parser", "Pattern", "Position", "Stream", "Tree")
)

export const specificChildImports = {
	IndexMap: objectImports(
		"FastLookupTable",
		"HashMap",
		"LinearIndexMap",
		"PersistentIndexMap"
	)
}
