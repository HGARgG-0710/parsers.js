import { ConstEnum as ConstEnumClass } from "./classes.js"

export namespace ConstEnum {
	const { prototype } = ConstEnumClass
	export const { add, join, copy, map, get } = prototype

	const { get: _get, set } = Object.getOwnPropertyDescriptor(prototype, "size")! as {
		get: () => any
		set: (x: any) => any
	}

	export const size = { get: _get, set }
}
