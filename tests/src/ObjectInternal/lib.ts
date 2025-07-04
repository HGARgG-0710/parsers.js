import { PreMapClassTest } from "../PreMap/lib.js"

class ObjectInternalTest<T = any, Default = any> extends PreMapClassTest<
	string,
	T,
	Default
> {
	constructor() {
		super([], [])
	}
}

export function objectInternalTest<T = any, Default = any>() {
	return new ObjectInternalTest<T, Default>()
}
