import type {
	IIndexMap,
	IParserFunction,
	IPeekableStream,
	ITypeCheckable
} from "../../../../interfaces.js"
import {
	LiquidMap,
	TableCarrier
} from "../../../../modules/IndexMap/objects/LiquidMap.js"
import { IndexMap } from "../../../../objects.js"
import { Pairs } from "../../../../samples.js"
import { NodeMap, PeekMap } from "../../../../utils/IndexMap.js"

export function LookaheadMap(
	map: Iterable<[ITypeCheckable, IParserFunction]>,
	_default: IParserFunction
): IIndexMap<
	ITypeCheckable,
	IParserFunction,
	IParserFunction,
	IPeekableStream
> {
	const [keys, values] = Pairs.from(map)
	return (
		PeekMap(
			NodeMap(new IndexMap.PredicateMap(new LiquidMap([], [])))
		).finalize() as IIndexMap<
			ITypeCheckable,
			IParserFunction,
			IParserFunction,
			IPeekableStream
		>
	).fromCarrier(new TableCarrier(keys, values, _default))
}
