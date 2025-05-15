import type { IIndexable } from "src/interfaces.js"
import type { IParserFunction } from "../interfaces/StreamHandler.js"

export function TableMap<In = any, Out = any>(
	indexMap: IIndexable<IParserFunction<In, Out>>
): (x?: In, ...y: any[]) => Out {
	const T = function (x?: In, ...y: any[]) {
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
