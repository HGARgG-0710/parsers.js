import assert from "assert"
import { ObjectPool, type IPoolable } from "../../../../dist/main.js"
import { assertThrowingFails, ClassTest, MethodTest } from "../../lib.js"

export enum PoolState {
	Active = 1,
	Inactive = 2
}

function assertBaseCreationPostConditions<T extends IPoolable = any>(
	newItem: T,
	pool: ObjectPool<T>,
	typeSpecificPostCreationAssertion: (item: T) => void
) {
	assert.strictEqual(newItem.poolId, pool.id)
	assert.strictEqual(newItem.isUsed, true)
	typeSpecificPostCreationAssertion(newItem)
}

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

const free = new MethodTest(
	"free",
	function <T extends IPoolable = any, Args extends any[] = any[]>(
		this: ObjectPool<T>,
		factory: () => T,
		initWith: Args,
		// easier and more powerful to use an assertion callback here than a stub
		runPostFreeAssertions: (instance: T) => void
	) {
		const origSize = this.size
		const instance = factory()
		this.free(instance)
		assert(!instance.isUsed)
		assertThrowingFails(() => this.free(instance))
		assert.strictEqual(this.size, origSize + 1)
		runPostFreeAssertions(instance)

		const restored = this.create(...initWith)
		assert.strictEqual(restored, instance)

		this.free(instance) // mutating the state, to allow flow-based testing
	}
)

const freeForeignFails = new MethodTest("freeForeignFails", function <
	T extends IPoolable = any
>(this: ObjectPool<T>, foreign: ObjectPool<T>, foreignInstance: T) {
	assert.strictEqual(foreignInstance.poolId, foreign.id)
	assertThrowingFails(() => this.free(foreignInstance))
})

const createNonEmpty = new MethodTest("createNonEmpty", function <
	T extends IPoolable = any,
	Args extends any[] = any[]
>(this: ObjectPool<T>, typeSpecificPostCreationAssertion: (item: T) => void, ...args: Args) {
	assert(this.size > 0)
	const origSize = this.size
	const newItem = this.create(...args)
	assert.strictEqual(this.size, origSize - 1)
	assertBaseCreationPostConditions(
		newItem,
		this,
		typeSpecificPostCreationAssertion
	)
})

const createEmpty = new MethodTest("createEmpty", function <
	T extends IPoolable = any,
	Args extends any[] = any[]
>(this: ObjectPool<T>, typeSpecificPostCreationAssertion: (item: T) => void, ...args: Args) {
	assert.strictEqual(this.size, 0)
	const newItem = this.create(...args)
	assert.strictEqual(this.size, 0)
	assertBaseCreationPostConditions(
		newItem,
		this,
		typeSpecificPostCreationAssertion
	)
})

const clear = new MethodTest("clear", function <
	T extends IPoolable = any
>(this: ObjectPool<T>) {
	this.clear()
	assert.strictEqual(this.size, 0)
})

class ObjectPoolTest<
	T extends IPoolable<Args> = any,
	Args extends any[] = any[]
> extends ClassTest<ObjectPool<T, Args>> {
	clear() {
		this.testMethod("clear")
	}

	createEmpty(
		assertionCallback: (item: T) => void,
		...args: Partial<Args> | []
	) {
		this.testMethod("createEmpty", assertionCallback, ...args)
	}

	createNonEmpty(
		assertionCallback: (item: T) => void,
		...args: Partial<Args> | []
	) {
		this.testMethod("createNonEmpty", assertionCallback, ...args)
	}

	freeForeignFails(foreign: ObjectPool<T>, foreignInstance: T) {
		this.testMethod("freeForeignFails", foreign, foreignInstance)
	}

	free(
		factory: () => T,
		initWith: Args,
		runPostFreeAssertions: (instance: T) => void
	) {
		this.testMethod("free", factory, initWith, runPostFreeAssertions)
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

export function objectPoolTest<
	T extends IPoolable = any,
	Args extends any[] = any[]
>() {
	return new ObjectPoolTest<T, Args>()
}
