import { object } from "@hgargg-0710/one"
import assert from "node:assert"
import test from "node:test"
import { Autocache } from "../../../dist/src/classes.js"
import { ArrayMap } from "../../../dist/src/classes/IndexMap.js"
import type { ICopiable } from "../../../dist/src/interfaces.js"

const { keys } = object

export interface Interface {
	readonly interfaceName: string
	conformance(x: any): boolean
}

export class ClassTest<InstanceType extends ICopiable = any> {
	protected testMethod(name: string, ...args: any[]) {
		const { methods } = this
		const names = this.methods.map((x) => x.name)
		const index = names.indexOf(name)

		if (index === -1)
			throw new TypeError(
				`Test for method \`${name}\` not found in ${names}`
			)

		return methods[index].withInstance(this.instance!.copy(), ...args)
	}

	protected instance: InstanceType | null

	protected typeCheck() {
		for (const _interface of this.interfaces)
			if (!_interface.conformance(this.instance))
				throw new TypeError(
					`Tested instance failed to conform to interface: ${_interface.interfaceName}`
				)
	}

	withInstance(
		instance: InstanceType,
		callback: (test: ClassTest<InstanceType>) => void
	) {
		this.instance = instance
		this.typeCheck()
		callback(this)
		this.instance = null
	}

	constructor(
		protected interfaces: Interface[],
		protected methods: MethodTest<InstanceType>[]
	) {}
}

export class MethodTest<InstanceType = any> {
	withInstance(instance: InstanceType, ...x: any[]) {
		return this.handler.call(instance, ...x)
	}

	constructor(readonly name: string, protected handler: Function) {}
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
	private prefixes = Autocache(new ArrayMap([]), () => new PrefixCounter())

	test(testPrefix: number[], callback: () => void) {
		const prefixCounter: PrefixCounter = this.prefixes(testPrefix)
		prefixCounter.inc()
		return test(this.label(prefixCounter.fromPrefix(testPrefix)), callback)
	}

	constructor(private readonly label: (count: readonly number[]) => string) {}
}
