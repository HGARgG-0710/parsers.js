import { object } from "@hgargg-0710/one"
import assert from "node:assert"
import test from "node:test"
import { LiquidMap } from "../../dist/src/modules/IndexMap/objects/LiquidMap.js"
import { AutoCache } from "../../dist/src/objects.js"
import {
	IndexMap,
	ModifiableMap
} from "../../dist/src/objects/IndexMap.js"

const { keys } = object

export class ClassTest<InstanceType = any> {
	private instance: InstanceType | null = null
	private readonly names: string[]

	private callMethodTest(
		atIndex: number,
		instance: InstanceType,
		...args: any[]
	): void {
		return this.methods[atIndex].withInstance(instance, ...args)
	}

	protected testMethod(name: string, ...args: any[]) {
		const index = this.names.indexOf(name)

		if (index === -1)
			throw new TypeError(
				`Test for method \`${name}\` not found in ${this.names.join(", ")}`
			)

		return this.callMethodTest(index, this.instance!, ...args)
	}

	withInstance(
		instanceMaker: () => InstanceType,
		callback: (test: this) => void
	) {
		this.instance = instanceMaker()
		callback(this)
	}

	constructor(protected readonly methods: MethodTest<InstanceType>[]) {
		this.names = methods.map((x) => x.name)
	}
}

export class MethodTest<InstanceType = any, Args extends any[] = any[]> {
	withInstance(instanceMaker: InstanceType, ...x: Args) {
		return this.handler.call(instanceMaker, ...x)
	}

	constructor(
		readonly name: string,
		protected handler: (...args: Args) => void
	) {}
}

export interface InterfaceShape<T = any> {
	[key: object.ObjectKey]: (instance: T) => boolean
}

export class InterfaceTest<T = any, Args extends any[] = any[]> {
	withClass(tested: new (...args: Args) => T) {
		const interfacePredicates = this.shape
		return function (...args: Args) {
			const instance = new tested(...args)
			for (const key of keys(interfacePredicates))
				assert(interfacePredicates[key](instance))
		}
	}

	constructor(private readonly shape: InterfaceShape<T>) {}
}

export class PrefixCounter {
	private _counter: number = 0

	get counter() {
		return this._counter
	}

	inc() {
		++this._counter
	}

	fromPrefix(prefix: number[]) {
		return [...prefix, this.counter]
	}
}

export class TestCounter {
	private readonly prefixes = AutoCache(
		new ModifiableMap(
			new IndexMap.ArrayMap<number[], PrefixCounter, undefined>(
				new LiquidMap()
			)
		),
		() => new PrefixCounter()
	)

	test(
		testPrefix: number[],
		callback: () => void,
		toTest: boolean = false
	) {
		const prefixCounter: PrefixCounter = this.prefixes(testPrefix)
		prefixCounter.inc()
		return test(
			this.label(prefixCounter.fromPrefix(testPrefix)),
			{ only: toTest },
			callback
		)
	}

	constructor(
		private readonly label: (count: readonly number[]) => string
	) {}
}

function checkDidThrow(callback: () => void) {
	try {
		callback()
		return false
	} catch {
		return true
	}
}

export function assertThrowing(callback: () => void) {
	assert(!checkDidThrow(callback))
}

export function assertThrowingFails(callback: () => void) {
	assert(checkDidThrow(callback))
}
