import { fromPairsList } from "./utils.js"
import type {
	MapClass,
	IndexMap,
	IndexingFunction,
	TestType,
	HasType
} from "./interfaces.js"
import {
	indexMapIndex,
	indexMapReplace,
	indexMapAdd,
	indexMapDelete,
	indexMapUnique,
	indexMapByIndex,
	indexMapIterator,
	indexMapSwap
} from "./methods.js"
import { mapClassExtend, mapClassExtendKey } from "./utils.js"
import { current, firstStream, is } from "src/utils.js"
import { Token } from "src/Pattern/Token/classes.js"

export function MapClass<KeyType = any, ValueType = any>(
	change: IndexingFunction<KeyType>
): MapClass<KeyType, ValueType> {
	const mapClass: MapClass<KeyType, ValueType> = function (
		pairsList: [KeyType, ValueType][],
		_default?: any
	): IndexMap<KeyType, ValueType> {
		const [keys, values] = fromPairsList(pairsList)
		return {
			keys,
			values,
			change,
			index: indexMapIndex<KeyType, ValueType>,
			replace: indexMapReplace<KeyType, ValueType>,
			add: indexMapAdd<KeyType, ValueType>,
			delete: indexMapDelete<KeyType, ValueType>,
			unique: indexMapUnique<KeyType, ValueType>,
			byIndex: indexMapByIndex<KeyType, ValueType>,
			swap: indexMapSwap<KeyType, ValueType>,
			default: _default,
			[Symbol.iterator]: indexMapIterator<KeyType, ValueType>
		}
	}
	mapClass.extend = mapClassExtend(change)
	mapClass.extendKey = mapClassExtendKey(change)
	return mapClass
}

export const [PredicateMap, RegExpMap, SetMap, BasicMap]: [
	MapClass<Function>,
	MapClass<TestType>,
	MapClass<HasType>,
	MapClass
] = [
	(curr: Function, x: any) => curr(x),
	(curr: TestType, x: any) => curr.test(x),
	(curr: HasType, x: any) => curr.has(x),
	(curr: any, x: any) => curr === x
].map(MapClass) as [any, any, any, any]

export const [TokenMap, ValueMap, CurrentMap, FirstStreamMap] = [
	Token.type,
	Token.value,
	current,
	firstStream
].map((x) => (mapClass: MapClass) => mapClass.extend(x))

export const TypeMap = (mapClass: MapClass) => mapClass.extendKey(is)
