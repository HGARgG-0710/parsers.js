import assert from "node:assert"
import { describe, it } from "node:test"

import type { Tree } from "../../../../dist/src/Tree/interfaces.js"
import { ChildlessTree, MultTree, SingleTree } from "../../../../dist/src/Tree/classes.js"
import { ambigiousMethodTest, FunctionalClassConctructorTest } from "lib/lib.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { isFunction, isNumber } = type

const { structCheck } = object

export const isTree = structCheck<Tree>({
	lastChild: isNumber,
	index: isFunction
})

function ChildlessTreeTest(childlessTree: any, propName: string) {
	describe(`class: ChildlessTree (${propName})`, () =>
		assert.strictEqual(ChildlessTree(propName)(childlessTree).length, 0))
}

function SingleTreeTest(
	childrenTree: any,
	propName: string,
	converter?: (x: any) => any
) {
	describe(`class: SingleTree (${propName})`, () => {
		const oldValue = childrenTree.value
		const singled = SingleTree(propName)(childrenTree, converter)
		assert.strictEqual(singled[propName].length, 1)
		if (propName === "value") assert.notStrictEqual(oldValue, singled.value)
		else assert.strictEqual(singled[propName][0], converter(singled.value))
	})
}

function MultTreeTest(childrenTree: any, propName: string, converter?: (x: any) => any) {
	describe(`class: MultTree (${propName})`, () => {
		const oldValue = childrenTree.value
		const multed = MultTree(propName)(childrenTree, converter)
		assert.strictEqual(multed.value.length, multed[propName].length)
		if (propName === "value") assert.strictEqual(oldValue, multed.value)
		assert.strictEqual(childrenTree, multed)
	})
}

type TreeSignature = {
	propName: string
	childrenTrees: any[]
}

type ConvertedTreeSignature = {
	converter?: (x: any) => any
}

type ChildlessTreeTestSignature = TreeSignature
type SingleTreeTestSignature = TreeSignature & ConvertedTreeSignature
type MultTreeTestSignature = TreeSignature & ConvertedTreeSignature

export function TreeTestSuite(
	childless: ChildlessTreeTestSignature[],
	single: SingleTreeTestSignature[],
	multiple: MultTreeTestSignature[]
) {
	for (const s_childless of childless) {
		const { propName, childrenTrees } = s_childless
		for (const childrenTree of childrenTrees)
			ChildlessTreeTest(propName, childrenTree)
	}

	for (const s_single of single) {
		const { propName, childrenTrees, converter } = s_single
		for (const childrenTree of childrenTrees)
			SingleTreeTest(propName, childrenTree, converter)
	}

	for (const s_multiple of multiple) {
		const { propName, childrenTrees, converter } = s_multiple
		for (const childrenTree of childrenTrees)
			MultTreeTest(propName, childrenTree, converter)
	}
}

const TreeConstructorTest = FunctionalClassConctructorTest<Tree>(isTree)

const TreeIndexTest = ambigiousMethodTest<Tree>("index")

function TreeLastChildTest(tree: Tree, index: number[], expectedLastChild: number) {
	it(`property: .lastChild`, () =>
		assert.strictEqual(tree.index(index).lastChild, expectedLastChild))
}

type TreeClassTestSignature = {
	input: any
	indexTests: [number[], any, (x: any) => any][]
	lastChildTests: [number[], number][]
}

export function TreeClassTest(
	className: string,
	treeConstructor: (x: any) => Tree,
	instances: TreeClassTestSignature[]
) {
	describe(`class: (Tree) ${className}`, () => {
		for (const instance of instances) {
			const { input, indexTests, lastChildTests } = instance
			const treeInstance: Tree = TreeConstructorTest(treeConstructor, input)

			// .index
			for (const [index, expected, compare] of indexTests)
				TreeIndexTest(treeInstance, [index], expected, compare)

			// .lastChild
			for (const [index, lastChild] of lastChildTests)
				TreeLastChildTest(treeInstance, index, lastChild)
		}
	})
}
