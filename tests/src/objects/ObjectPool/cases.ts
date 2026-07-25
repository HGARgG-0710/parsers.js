import assert from "assert"
import {
	Config,
	ObjectPool,
	type IPoolable
} from "../../../../dist/main.js"
import { MissingArgument } from "../../../../dist/src/global/constants.js"
import { TestCounter } from "../../lib.js"
import { objectPoolTest, PoolState as PoolStartState } from "./lib.js"

const objectPoolTestCounter = new TestCounter(
	([isActiveOnStart, testNumber]: readonly number[]) =>
		`ObjectPool (${isActiveOnStart}.${testNumber})`
)

class Retainer<T = any> implements IPoolable<
	[T, ObjectPool<Retainer<T>>]
> {
	private item: T | null = null
	private _isUsed: boolean = true
	private pool: ObjectPool<Retainer<T>> | null = null

	get poolId() {
		return this.pool!.id
	}

	postFree(): void {
		this.item = null
	}

	init(item?: T, pool?: ObjectPool<Retainer<T>>): this {
		if (item !== MissingArgument) this.item = item
		if (pool !== MissingArgument) this.pool = pool
		return this
	}

	get isUsed() {
		return this._isUsed
	}

	markFree(): void {
		this._isUsed = false
	}

	markUsed(): void {
		this._isUsed = true
	}

	getItem() {
		return this.item
	}

	constructor(item?: T, pool?: ObjectPool<Retainer<T>>) {
		if (item !== MissingArgument) this.item = item
		if (pool) this.pool = pool
	}
}

const getTestInstance = <T = any>() =>
	objectPoolTest<Retainer<T>, [T, ObjectPool<Retainer<T>>]>()

const getEmptyPool = <T = any>() =>
	new ObjectPool<Retainer<T>, [T, ObjectPool<Retainer<T>>]>(Retainer)

const getNewInstance = <T = any>(item: T, pool: ObjectPool<Retainer<T>>) =>
	new Retainer<T>(item, pool)

const assertPostFreeRan = (instance: Retainer) =>
	assert.strictEqual(instance.getItem(), null)

// ! pre-requsites:
// * 	1. creation of pool objects and

function baseActiveTest(limit: number) {
	const primaryPool = getEmptyPool<number>()
	const foreignPool = getEmptyPool<number>()
	const foreignRetainer = getNewInstance<number>(2, foreignPool)
	foreignPool.free(foreignRetainer)

	getTestInstance<number>().withInstance(
		() => primaryPool,
		(test) => {
			test.size(0)

			test.createEmpty(
				(instance) => assert.strictEqual(instance.getItem(), 5),
				5,
				primaryPool
			)

			test.size(0)
			test.free(
				() => getNewInstance<number>(0, primaryPool),
				[1, primaryPool],
				assertPostFreeRan
			)

			test.size(1)
			test.createNonEmpty(assertPostFreeRan, 7)
			test.size(0)
			test.limitSize(limit, () => new Retainer<number>(10, primaryPool))
			test.clear()
			test.size(0)
			test.freeForeignFails(foreignPool, foreignRetainer)
		}
	)
}

// ! categories:
// * 	1. Active/Inactive [pool start state]

objectPoolTestCounter.test([PoolStartState.Active], () => {
	Config.objectPools.enable = true
	baseActiveTest(Config.objectPools.defaultSizeLimit)
})

// ! tests:
// 		2. inactive base usage test:
// 			1.
// 		3. active -> inactive switch usage test (modifying the `global.Config.objectPools.enable` to `false`)
// 			1. starts with the 1. [active base usage testing]
// 			2. ends with the 2. [inactive base usage testing]
// 		4. inactive -> active

// ! METHODS TESTS THAT WORK WITH 'inactive' AS WELL:
// 		2. freeForeignFails
// 		3. clear
