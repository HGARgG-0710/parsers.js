import assert from "assert"
import { ObjectPool, type IPoolable } from "../../../../dist/main.js"
import { assertThrowingFails, ClassTest, MethodTest } from "../../lib.js"

function ignoreMethodCall<Args extends any[] = any[]>(
	callback: (this: ObjectPool, ...args: Args) => void
) {
	return function (this: ObjectPool, ...args: Args) {
		const origSize = this.size
		callback.call(this, ...args)
		assert.strictEqual(this.size, origSize)
	}
}

const inactive = {
	free: new MethodTest(
		"inactive.free",
		ignoreMethodCall(function <T extends IPoolable = any>(
			this: ObjectPool<T>,
			instance: T
		) {
			this.free(instance)
		})
	),

	create: new MethodTest(
		"inactive.create",
		ignoreMethodCall(function <
			T extends IPoolable = any,
			Args extends any[] = any[]
		>(this: ObjectPool<T>, ...args: Args) {
			this.create(...args)
		})
	),

	size: new MethodTest("inactive.size", function (this: ObjectPool) {
		assert.strictEqual(this.size, 0)
	})
}

const limitSize = new MethodTest<ObjectPool, [number, () => any]>(
	"limitSize",
	function <T extends IPoolable = any>(
		this: ObjectPool<T>,
		limitUsed: number,
		factory: () => T
	) {
		assert.strictEqual(this.size, 0)
		for (let i = 0; i < limitUsed; ++i) this.free(factory())
		assertThrowingFails(() => this.free(factory()))
		assert.strictEqual(this.size, limitUsed)
	}
)

const size = new MethodTest(
	"size",
	function (this: ObjectPool, expected: number) {
		assert(expected >= 0)
		assert.strictEqual(this.size, expected)
	}
)

const free = new MethodTest("free", function <
	T extends IPoolable = any
>(this: ObjectPool<T>, factory: () => T) {
	const origSize = this.size
	const instance = factory()
	this.free(instance)
	assert(!instance.isUsed)
	assertThrowingFails(() => this.free(instance))
	assert.strictEqual(this.size, origSize + 1)
})

const freeForeignFails = new MethodTest("freeForeignFails", function <
	T extends IPoolable = any
>(this: ObjectPool<T>, foreign: ObjectPool<T>, foreignInstance: T) {
	assert.strictEqual(foreignInstance.poolId, foreign.id)
	assertThrowingFails(() => this.free(foreignInstance))
})

const createNonEmpty = new MethodTest("createNonEmpty", function <
	T extends IPoolable = any,
	Args extends any[] = any[]
>(this: ObjectPool<T>, ...args: Args) {
	assert(this.size > 0)
	const origSize = this.size
	const newItem = this.create(...args)
	assert.strictEqual(this.size, origSize - 1)
	assert.strictEqual(newItem.poolId, this.id)
	assert.strictEqual(newItem.isUsed, true)
})

const createEmpty = new MethodTest("createEmpty", function <
	T extends IPoolable = any,
	Args extends any[] = any[]
>(this: ObjectPool<T>, ...args: Args) {
	assert.strictEqual(this.size, 0)
	const newItem = this.create(...args)
	assert.strictEqual(this.size, 0)
	assert.strictEqual(newItem.poolId, this.id)
	assert.strictEqual(newItem.isUsed, true)
})

const clear = new MethodTest("clear", function <
	T extends IPoolable = any
>(this: ObjectPool<T>) {
	this.clear()
	assert.strictEqual(this.size, 0)
})

export class ObjectPoolText<
	T extends IPoolable<Args> = any,
	Args extends any[] = any[]
> extends ClassTest<ObjectPool<T, Args>> {
	clear() {
		this.testMethod("clear")
	}

	createEmpty(...args: Args) {
		this.testMethod("createEmpty", ...args)
	}

	createNonEmpty(...args: Args) {
		this.testMethod("createNonEmpty", ...args)
	}

	freeForeignFails(foreign: ObjectPool<T>, foreignInstance: T) {
		this.testMethod("freeForeignFails", foreign, foreignInstance)
	}

	free(factory: () => T) {
		this.testMethod("free", factory)
	}

	size(expected: number) {
		this.testMethod("size", expected)
	}

	limitSize(limit: number, factory: () => T) {
		this.testMethod("limitSize", limit, factory)
	}

	inactiveSize() {
		this.testMethod("inactive.size")
	}

	inactiveCreate(...args: Args) {
		this.testMethod("inactive.create", ...args)
	}

	inactiveFree(instance: T) {
		this.testMethod("inactive.free", instance)
	}

	constructor() {
		super([
			clear,
			createEmpty,
			createNonEmpty,
			freeForeignFails,
			free,
			size,
			limitSize,
			inactive.size,
			inactive.create,
			inactive.free
		])
	}
}
