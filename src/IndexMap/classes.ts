import type { MapClass } from "./interfaces.js"
import type { array } from "@hgargg-0710/one"

import { type } from "../Token/utils.js"
import { value } from "../Pattern/utils.js"
import { current } from "src/Stream/utils.js"
import { is } from "src/Token/utils.js"

import { type as _type } from "@hgargg-0710/one"
const { typeOf, isNumber } = _type

export const [TokenMap, ValueMap, CurrentMap, TypeofMap] = [
	type,
	value,
	current,
	typeOf
].map((x) => (mapClass: MapClass) => mapClass.extend(x))

export const TypeMap = (mapClass: MapClass) => mapClass.extendKey(is)

export const Pairs = <KeyType = any, ValueType = any>(
	...pairs: array.Pairs<KeyType, ValueType> | [number]
) => {
	const n = pairs[0]
	return (
		isNumber(n) ? Array.from({ length: n }, () => new Array(2)) : pairs
	) as array.Pairs<KeyType, ValueType>
}

export * as LookupTable from "./LookupTable/classes.js"
export * as HashMap from "./HashMap/classes.js"
export * as LinearIndexMap from "./LinearIndexMap/classes.js"

export * from "./PersistentIndexMap/classes.js"
