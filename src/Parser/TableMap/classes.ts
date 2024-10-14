import type { Indexable } from "../../IndexMap/interfaces.js"
import type { ParserFunction } from "./interfaces.js"

export function TableMap<OutType = any>(
	indexMap: Indexable<ParserFunction<any, OutType>>
): (x?: any) => OutType {
	const T = (x?: any) => T.table.index(x)(x, T)
	T.table = indexMap
	return T
}
