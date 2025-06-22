import { object } from "@hgargg-0710/one"
import assert from "node:assert"
import test from "node:test"
import { Autocache } from "../../dist/src/classes.js"
import { IndexMap, ModifiableMap } from "../../dist/src/classes/IndexMap.js"
import type { ICopiable } from "../../dist/src/interfaces.js"
import { LiquidMap } from "../../dist/src/modules/IndexMap/classes/LiquidMap.js"

const { keys } = object

export interface RuntimeInterface {
	readonly interfaceName: string
	conformance(x: any): boolean
}

abstract class ClassTest<InstanceType = any> {
	private instance: InstanceType | null = null
	private readonly names: string[]

	protected abstract callMethodTest(
		atIndex: number,
		instance: InstanceType,
		...args: any[]
	): void

	private typeCheck() {
		for (const _interface of this.interfaces)
			if (!_interface.conformance(this.instance))
				throw new TypeError(
					`Tested instance failed to conform to interface: ${_interface.interfaceName}`
				)
	}

	protected testMethod(name: string, ...args: any[]) {
		const index = this.names.indexOf(name)

		if (index === -1)
			throw new TypeError(
				`Test for method \`${name}\` not found in ${this.names.join(
					", "
				)}`
			)

		return this.callMethodTest(index, this.instance!, ...args)
	}

	withInstance(instance: InstanceType, callback: (test: this) => void) {
		const prevInstance = this.instance
		this.instance = instance
		this.typeCheck()
		callback(this)
		this.instance = prevInstance
	}

	constructor(
		private readonly interfaces: RuntimeInterface[],
		protected readonly methods: MethodTest<InstanceType>[]
	) {
		this.names = methods.map((x) => x.name)
	}
}

export class ImmutableClassTest<
	InstanceType = any
> extends ClassTest<InstanceType> {
	protected callMethodTest(
		atIndex: number,
		instance: InstanceType,
		...args: any[]
	): void {
		return this.methods[atIndex].withInstance(instance, ...args)
	}
}

export class MutableClassTest<
	InstanceType extends ICopiable = any
> extends ClassTest<InstanceType> {
	protected callMethodTest(
		atIndex: number,
		instance: InstanceType,
		...args: any[]
	): void {
		return this.methods[atIndex].withInstance(instance.copy(), ...args)
	}
}

export class MethodTest<InstanceType = any, Args extends any[] = any[]> {
	withInstance(instance: InstanceType, ...x: Args) {
		return this.handler.call(instance, ...x)
	}

	constructor(
		readonly name: string,
		protected handler: (...args: Args) => void
	) {}
}

export type InterfaceShape = object

export class InterfaceTest<T = any, Args extends any[] = any[]> {
	withClass(tested: new (...args: Args) => T) {
		const interfacePredicates = this.shape
		return function (...args: Args) {
			const instance = new tested(...args)
			for (const key of keys(interfacePredicates))
				assert(interfacePredicates[key](instance))
		}
	}

	constructor(private readonly shape: InterfaceShape) {}
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
	private readonly prefixes = Autocache(
		new ModifiableMap(new IndexMap.ArrayMap(new LiquidMap())),
		() => new PrefixCounter()
	)

	test(testPrefix: number[], callback: () => void, toTest: boolean = false) {
		const prefixCounter: PrefixCounter = this.prefixes(testPrefix)
		prefixCounter.inc()
		return test(
			this.label(prefixCounter.fromPrefix(testPrefix)),
			{ only: toTest },
			callback
		)
	}

	constructor(private readonly label: (count: readonly number[]) => string) {}
}

export function assertThrowing(callback: () => void) {
	try {
		callback()
	} catch {
		assert(false)
	}
}

export function assertThrowingFails(callback: () => void) {
	let hasThrown = false
	try {
		callback()
	} catch {
		hasThrown = true
	}
	assert(hasThrown)
}
