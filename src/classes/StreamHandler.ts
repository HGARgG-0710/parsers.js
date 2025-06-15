import type { IIndexable } from "../interfaces.js"
import type { IParserFunction } from "../interfaces/StreamHandler.js"

export function TableHandler<In = any, Out = any>(
	indexMap: IIndexable<IParserFunction<In, Out>>
): (x?: In, ...y: any[]) => Out {
	const T = function (x?: In, ...y: any[]) {
		return T.table.index(x, ...y).call(this, x, T, ...y)
	}
	T.table = indexMap
	return T
}

export function WrapHandler<Out = any>(
	indexMap: IIndexable<Out>
): (x?: any, ...y: any[]) => Out {
	const T = (x: any, ...y: any[]) => T.table.index(x, ...y)
	T.table = indexMap
	return T
}
