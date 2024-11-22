import type { MapClass, Pairs as PairsType } from "./interfaces.js"
import { type } from "../Token/utils.js"
import { value } from "../Pattern/utils.js"
import { current, is } from "../utils.js"

import { typeof as _typeof } from "@hgargg-0710/one"
const { typeOf, isNumber } = _typeof

export const [TokenMap, ValueMap, CurrentMap, TypeofMap] = [
	type,
	value,
	current,
	typeOf
].map((x) => (mapClass: MapClass) => mapClass.extend(x))

export const TypeMap = (mapClass: MapClass) => mapClass.extendKey(is)

export const Pairs = <KeyType = any, ValueType = any>(
	...pairs: PairsType<KeyType, ValueType> | [number]
) => {
	const n = pairs[0]
	return (
		isNumber(n) ? Array.from({ length: n }, () => new Array(2)) : pairs
	) as PairsType<KeyType, ValueType>
}

export * as FastLookupTable from "./FastLookupTable/classes.js"
export * as HashMap from "./HashMap/classes.js"
export * as LinearIndexMap from "./LinearIndexMap/classes.js"

export * from "./PersistentIndexMap/classes.js"
