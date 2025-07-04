import { PreMapTest } from "../PreMap/lib.js"

class MapInternalTest<K = any, V = any, Default = any> extends PreMapTest<
	K,
	V,
	Default
> {
	constructor() {
		super()
	}
}

export function mapInternalTest<K = any, V = any, Default = any>() {
	return new MapInternalTest<K, V, Default>()
}
