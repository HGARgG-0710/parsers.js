import assert from "assert"

import type { ICollection } from "../../../../dist/src/Collection/interfaces.js"

import { ClassTest, MethodTest, type Interface } from "../../lib/_lib.js"
import { isCollection } from "../../../../dist/src/Collection/utils.js"

import { array } from "@hgargg-0710/one"

const push = new MethodTest("push", function <Type = any>(
	this: ICollection<Type>,
	...items: Type[]
) {
	const prior = array.copy(this.get() as Type[])

	this.push(...items)

	const endIndex = array.lastIndex(prior)

	for (let i = 0; i < prior.length; ++i)
		assert.strictEqual(this.get()[i], prior[i])

	for (let i = 0; i < items.length; ++i)
		assert.strictEqual(this.get()[endIndex + i], items[i])
})

const get = new MethodTest("get", function <Type = any>(
	this: ICollection<Type>,
	expected: Iterable<Type>
) {
	assert(array.same(this.get(), expected))
	assert(array.same(this.get(), this.get()))
})

const SymbolIterator = new MethodTest("Symbol.iterator", function <Type = any>(
	this: ICollection<Type>
) {
	assert(array.same(this.get(), this))
})

const copy = new MethodTest("copy", function <Type = any>(
	this: ICollection<Type>,
	diff: Type[]
) {
	const duplicate = this.copy()

	assert.notStrictEqual(this, duplicate)
	assert(array.same(this, duplicate))

	this.push(...diff)
	assert(!array.same(this, duplicate))
})

class CollectionTest<Type = any> extends ClassTest<ICollection<Type>> {
	static readonly interfaceName = "ICollection"

	static conformance(x: any) {
		return isCollection(x)
	}

	push(...items: Type[]) {
		return this.testMethod("push", ...items)
	}

	get(expected: Iterable<Type>) {
		return this.testMethod("get", expected)
	}

	SymbolIterator() {
		return this.testMethod("Symbol.iterator")
	}

	copy(...diff: Type[]) {
		return this.testMethod("copy", ...diff)
	}

	constructor(
		interfaces: Interface[] = [],
		methods: MethodTest<ICollection<Type>>[] = []
	) {
		super(
			[CollectionTest, ...interfaces],
			[push, get, SymbolIterator, copy, ...methods]
		)
	}
}

export const CollectionTestObject = new CollectionTest()
