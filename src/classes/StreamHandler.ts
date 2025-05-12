import type { IIndexable } from "src/interfaces.js"
import type { IParserFunction } from "../interfaces/StreamHandler.js"

export function TableMap<OutType = any>(
	indexMap: IIndexable<IParserFunction<any, OutType>>
): (x?: any, ...y: any[]) => OutType {
	const T = function (x?: any, ...y: any[]) {
		return T.table.index(x, ...y).call(this, x, T, ...y)
	}
	T.table = indexMap
	return T
}

export function MapWrap<OutType = any>(
	indexMap: IIndexable<OutType>
): (x?: any, ...y: any[]) => OutType {
	const T = (x: any, ...y: any[]) => T.table.index(x, ...y)
	T.table = indexMap
	return T
}
