import type { Collection } from "./interfaces.js"

export function* collectionIterator(this: Collection<string>) {
	let i = 0
	while (this.value.length > i) {
		yield this.value[i]
		++i
	}
}

export * as Buffer from "./Buffer/methods.js"
