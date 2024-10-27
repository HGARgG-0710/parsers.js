import assert from "node:assert"
import { typeof as type } from "@hgargg-0710/one"
import { importName } from "lib/lib.js"
const { isObject, isFunction } = type

export function importTest(importsList: [string, (x: any) => boolean][]) {
	return function (moduleName: string, module: object) {
		importName(moduleName, () => {
			for (const [importName, importType] of importsList)
				assert(importName in module && importType(module[importName]))

			const importsNum = importsList.length
			assert.strictEqual(new Set(importsList.map((x) => x[0])).size, importsNum)
			assert.strictEqual(Object.keys(module).length, importsNum)
		})
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

export const specificChildImports = {
	toplevel: objectImports(
		"IndexMap",
		"Parser",
		"Pattern",
		"Position",
		"Stream",
		"Tree"
	),
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

export const topLevelImports = importTest(specificChildImports.toplevel)

export const emptyImportTest = importTest([])

export const prefixedImportNames =
	(prefix: string) =>
	(...importNames: string[]) =>
		importNames.map((x) => `${prefix}${x}`)

const firstUpper = (x: string) => `${x[0].toUpperCase()}${x.slice(1)}`

export const namesCapitalized = (...names: string[]) => names.map(firstUpper)
