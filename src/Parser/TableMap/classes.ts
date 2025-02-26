import type { Indexable } from "../../IndexMap/interfaces.js"
import type { ParserFunction } from "./interfaces.js"

export function TableMap<OutType = any>(
	indexMap: Indexable<ParserFunction<any, OutType>>
): (x?: any, ...y: any[]) => OutType {
	const T = function (x?: any, ...y: any[]) {
		return T.table.index(x, ...y).call(this, x, T, ...y)
	}
	T.table = indexMap
	return T
}

export function MapWrap<OutType = any>(
	indexMap: Indexable<OutType>
): (x?: any, ...y: any[]) => OutType {
	const T = (x: any, ...y: any[]) => T.table.index(x, ...y)
	T.table = indexMap
	return T
}
