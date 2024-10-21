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
		"PersistentIndexMap",
		"SubHaving"
	),
	Pattern: objectImports(
		"Collection",
		"EliminablePattern",
		"EnumSpace",
		"Token",
		"TokenizablePattern",
		"ValidatablePattern"
	),
	Position: objectImports("MultiIndex"),
	MultiIndex: objectImports("MultiIndexModifier"),
	Tree: objectImports("TreeWalker"),
	Stream: objectImports(
		"InputStream",
		"LimitedStream",
		"NestedStream",
		"PredicateStream",
		"ProlongedStream",
		"ReversibleStream",
		"StreamClass",
		"TreeStream"
	)
}

export const emptyImportTest = importTest([])

export const prefixedImportNames =
	(prefix: string) =>
	(...importNames: string[]) =>
		importNames.map((x) => `${prefix}${x}`)

const firstUpper = (x: string) => `${x[0].toUpperCase()}${x.slice(1)}`

export const namesCapitalized = (...names: string[]) => names.map(firstUpper)
