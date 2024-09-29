import type { BasicState } from "./interfaces.js"

export function basicParserChange<OutType = any>(
	this: BasicState<OutType>,
	x: Iterable<OutType>
) {
	this.result.push(...x)
}
