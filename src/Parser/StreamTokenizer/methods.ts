import { typeof as type } from "@hgargg-0710/one"
const { isFunction } = type

import type { StreamTokenizer } from "./interfaces.js"

export function streamTokenizerNext<Type = any>(this: StreamTokenizer<Type>) {
	const mapped = this.tokenMap(this.input)
	return isFunction(mapped) ? mapped.call(this, this.input) : mapped
}
