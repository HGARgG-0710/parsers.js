import { PreMapTest } from "../PreMap/lib.js"

export enum TestTypes {
	PLAIN_OBJECT = 0,
	PLAIN_ARRAY = 1,
	PLAIN_MAP = 2
}

class TerminalMapTest<K = any, V = any, Default = any> extends PreMapTest<
	K,
	V,
	Default
> {
	constructor() {
		super()
	}
}

export function terminalMapTest<K = any, V = any, Default = any>() {
	return new TerminalMapTest<K, V, Default>()
}
