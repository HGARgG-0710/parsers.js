export class AutoMap<K = any, V = any> {
	private readonly map: Map<K, V> = new Map()

	set(key: K, item: V) {
		this.map.set(key, item)
	}

	get(key: K) {
		const cachedItem = this.map.get(key)
		if (cachedItem === undefined) {
			const autoConstructed = this.autoItemMaker(key)
			this.map.set(key, autoConstructed)
			return autoConstructed
		}
		return cachedItem
	}

	constructor(private readonly autoItemMaker: (item: K) => V) {}
}
