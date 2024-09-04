import type { BasicState } from "./interfaces.js"

export function basicParserChange<KeyType = any, OutType = any>(
	this: BasicState<KeyType, OutType>,
	x: Iterable<OutType>
) {
	this.result.push(...x)
}
