import assert from "node:assert"
import { it } from "node:test"

import type { Tree } from "../../../../dist/src/Tree/interfaces.js"
import { ChildlessTree, MultTree, SingleTree } from "../../../../dist/src/Tree/classes.js"
import {
	classTest,
	FunctionalClassConctructorTest,
	methodTest,
	property,
	signatures
} from "lib/lib.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { isFunction, isNumber } = type

const { structCheck } = object

export const isTree = structCheck<Tree>({
	lastChild: isNumber,
	index: isFunction
})

function ChildlessTreeTest(childlessTree: any, propName: string) {
	classTest(`ChildlessTree(${propName})`, () =>
		assert.strictEqual(ChildlessTree(propName)(childlessTree).length, 0)
	)
}

function SingleTreeTest(
	childrenTree: any,
	propName: string,
	converter?: (x: any) => any
) {
	classTest(`SingleTree(${propName})`, () => {
		const oldValue = childrenTree.value
		const singled = SingleTree(propName)(childrenTree, converter)
		assert.strictEqual(singled[propName].length, 1)
		if (propName === "value") assert.notStrictEqual(oldValue, singled.value)
		else assert.strictEqual(singled[propName][0], converter(singled.value))
	})
}

function MultTreeTest(childrenTree: any, propName: string, converter?: (x: any) => any) {
	classTest(`MultTree(${propName})`, () => {
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

export function TreeTestSeveral(
	childless: ChildlessTreeTestSignature[],
	single: SingleTreeTestSignature[],
	multiple: MultTreeTestSignature[]
) {
	classTest(`ChildlessTree`, () =>
		signatures(childless, ({ propName, childrenTrees }) => () => {
			for (const childrenTree of childrenTrees)
				ChildlessTreeTest(propName, childrenTree)
		})
	)

	classTest(`SingleTree`, () =>
		signatures(single, ({ propName, childrenTrees, converter }) => () => {
			for (const childrenTree of childrenTrees)
				SingleTreeTest(propName, childrenTree, converter)
		})
	)

	classTest(`MultTree`, () =>
		signatures(multiple, ({ propName, childrenTrees, converter }) => () => {
			for (const childrenTree of childrenTrees)
				MultTreeTest(propName, childrenTree, converter)
		})
	)
}

const TreeConstructorTest = FunctionalClassConctructorTest<Tree>(isTree)

const TreeIndexTest = methodTest<Tree>("index")

function TreeLastChildTest(tree: Tree, index: number[], expectedLastChild: number) {
	property("lastChild", () =>
		assert.strictEqual(tree.index(index).lastChild, expectedLastChild)
	)
}

type TreeClassTestSignature = {
	input: any
	indexTests: [number[], any, (x: any) => any][]
	lastChildTests: [number[], number][]
}

export function TreeClassTest(
	className: string,
	treeConstructor: (x: any) => Tree,
	testSignatures: TreeClassTestSignature[]
) {
	classTest(`(Tree) ${className}`, () =>
		signatures(testSignatures, ({ input, indexTests, lastChildTests }) => () => {
			const treeInstance: Tree = TreeConstructorTest(treeConstructor, input)

			// .index
			for (const [index, expected, compare] of indexTests)
				TreeIndexTest(treeInstance, expected, compare, index)

			// .lastChild
			for (const [index, lastChild] of lastChildTests)
				TreeLastChildTest(treeInstance, index, lastChild)
		})
	)
}
