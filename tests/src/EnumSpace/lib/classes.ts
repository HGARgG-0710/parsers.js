import assert from "assert"
import type { IEnumSpace, IMappable } from "../../../../dist/src/interfaces.js"
import { ClassTest, MethodTest, type Interface } from "../../lib/_lib.js"

import { object, type, array } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { uniqueArr } = array

const isEnumSpace = structCheck<IEnumSpace>({
	copy: isFunction,
	add: isFunction,
	join: isFunction,
	map: isFunction
})

function handleNegative(n: number) {
	if (n < 0)
		throw new TypeError(
			`Expected a numeric value 'n' greater than or equal to 0, got ${n}`
		)
}

function verifyUniqueness<Type = any>(x: IEnumSpace<Type>) {
	const mapped = x.map()
	assert(array.same(uniqueArr(mapped), mapped))
}

const copy = new MethodTest("copy", function <Type = any>(
	this: IEnumSpace<Type>
) {
	const copied = this.copy()
	assert.notStrictEqual(this, copied)
	assert(array.same(this.map(), copied.map()))
})

const add = new MethodTest("add", function <Type = any>(
	this: IEnumSpace<Type>,
	n: number,
	expected: Iterable<Type>
) {
	handleNegative(n)

	const original = this.copy()
	const origMapped = original.map()
	const mapped = this.add(n).map()

	assert(!array.same(origMapped, mapped))
	assert.strictEqual(original.size, this.size - n)

	for (let i = 0; i < origMapped.length; ++i)
		assert.strictEqual(origMapped[i], mapped[i])

	assert(array.same(expected, mapped.slice(original.size, original.size + n)))

	verifyUniqueness(this)
})

const join = new MethodTest("join", function <Type = any>(
	this: IEnumSpace<Type>,
	enums: IEnumSpace<Type>
) {
	const original = this.copy()
	const origMapped = original.map()
	const mapped = this.join(enums).map()
	const enumsMapped = uniqueArr(enums.map())

	assert(!array.same(mapped, origMapped))
	assert(this.size - enums.size <= original.size)

	for (let i = 0; i < original.size; ++i)
		assert.strictEqual(mapped[i], origMapped[i])

	for (const x of enumsMapped) assert(mapped.includes(x))

	verifyUniqueness(this)
})

const map = new MethodTest("map", function <Type = any, Out = any>(
	this: IEnumSpace<Type>,
	expected: Iterable<Out>,
	f?: IMappable<Type, Out>
) {
	assert(array.same(this.map(f), expected))
})

class EnumSpaceTest<Type = any> extends ClassTest<IEnumSpace<Type>> {
	static readonly interfaceName = "IEnumSpace"

	static conformance(x: any) {
		return isEnumSpace(x)
	}

	copy() {
		return this.testMethod("copy")
	}

	add(n: number) {
		return this.testMethod("add", n)
	}

	join(enums: IEnumSpace<Type>) {
		return this.testMethod("join", enums)
	}

	map<Out = any>(expected: Iterable<Out>, f?: IMappable<Type, Out>) {
		return this.testMethod("map", expected, f)
	}

	constructor(interfaces: Interface[] = [], methods: MethodTest[] = []) {
		super(
			[EnumSpaceTest, ...interfaces],
			[copy, add, join, map, ...methods]
		)
	}
}

export const EnumSpaceTestObject = new EnumSpaceTest()
