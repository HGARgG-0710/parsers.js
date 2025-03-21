import type { ICopiable } from "../../../dist/src/interfaces.js"

export interface Interface {
	readonly interfaceName: string
	conformance(x: any): boolean
}

export class ClassTest<InstanceType extends ICopiable<InstanceType> = any> {
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
