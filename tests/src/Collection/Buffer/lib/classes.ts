import assert from "assert"

import type {
	IFreezableBuffer,
	IUnfreezableBuffer
} from "../../../../../dist/src/Collection/Buffer/interfaces.js"

import { isFreezableBuffer } from "../../../../../dist/src/Collection/Buffer/utils.js"

import { MethodTest, type Interface } from "../../../lib/_lib.js"
import { CollectionTest } from "../../lib/classes.js"

import { array, functional, object, type } from "@hgargg-0710/one"
const { and } = functional
const { structCheck } = object
const { isFunction } = type

function handleNonFrozen<Type = any>(instance: IFreezableBuffer<Type>) {
	if (!instance.isFrozen)
		throw new TypeError(
			"Expected an `IFreezableBuffer` instance with `.isFrozen === true`, got one with `.isFrozen === false` instead"
		)
}

const freeze = new MethodTest("freeze", function <Type = any>(
	this: IFreezableBuffer<Type>
) {
	this.freeze()
	assert.strictEqual(this.isFrozen, true)
})

const read = new MethodTest("read", function <Type = any>(
	this: IFreezableBuffer<Type>,
	i: number,
	expected: Type
) {
	assert.strictEqual(this.read(i), expected)
})

const pushFrozen = new MethodTest("pushFrozen", function <Type = any>(
	this: IFreezableBuffer<Type>,
	...items: Type[]
) {
	handleNonFrozen(this)

	const original = this.copy()

	this.push(...items)
	assert(array.same(this, original))
})

class FreezableBufferTest<Type = any> extends CollectionTest<Type> {
	static readonly interfaceName: string = "IFreezableBuffer"

	protected instance: IFreezableBuffer<Type> | null

	static conformance(x: any) {
		return isFreezableBuffer(x)
	}

	push(...items: Type[]) {
		return this.instance!.isFrozen
			? this.pushFrozen(...items)
			: super.push(...items)
	}

	freeze() {
		return this.testMethod("freeze")
	}

	protected pushFrozen(...items: Type[]) {
		return this.testMethod("pushFrozen", ...items)
	}

	constructor(
		interfaces: Interface[] = [],
		methods: MethodTest<IFreezableBuffer<Type>>[] = []
	) {
		super(
			[FreezableBufferTest, ...interfaces],
			[freeze, read, pushFrozen, ...methods]
		)
	}
}

const isUnfreezableBuffer = and(
	isFreezableBuffer,
	structCheck({
		unfreeze: isFunction
	})
) as <Type = any>(x: any) => x is IUnfreezableBuffer<Type>

const unfreeze = new MethodTest("unfreeze", function <Type = any>(
	this: IUnfreezableBuffer<Type>
) {
	this.unfreeze()
	assert.strictEqual(this.isFrozen, false)
})

class UnfreezableBufferTest<Type = any> extends FreezableBufferTest<Type> {
	static readonly interfaceName: string = "IUnfreezableBuffer"

	protected instance: IUnfreezableBuffer<Type> | null

	static conformance(x: any) {
		return isUnfreezableBuffer(x)
	}

	unfreeze() {
		return this.testMethod("unfreeze")
	}

	constructor(
		interfaces: Interface[] = [],
		methods: MethodTest<IUnfreezableBuffer<Type>>[] = []
	) {
		super([UnfreezableBufferTest, ...interfaces], [unfreeze, ...methods])
	}
}

export const UnfreezableArrayTestObject = new UnfreezableBufferTest()
export const UnfreezableStringTestObject = new UnfreezableBufferTest<string>()
