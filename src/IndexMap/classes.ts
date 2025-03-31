import type { IMapClass } from "./interfaces.js"
import type { array } from "@hgargg-0710/one"

import { is } from "../Node/utils.js"
import { type } from "src/Node/utils.js"
import { value } from "../utils.js"
import { current } from "../Stream/utils.js"

import { type as _type } from "@hgargg-0710/one"
const { typeOf, isNumber } = _type

export const [TokenMap, ValueMap, CurrentMap, TypeofMap] = [
	type,
	value,
	current,
	typeOf
].map((x) => (mapClass: IMapClass) => mapClass.extend(x))

export const TypeMap = (mapClass: IMapClass) => mapClass.extendKey(is)

export const Pairs = <KeyType = any, ValueType = any>(
	...pairs: array.Pairs<KeyType, ValueType> | [number]
) => {
	const n = pairs[0]
	return (
		isNumber(n) ? Array.from({ length: n }, () => new Array(2)) : pairs
	) as array.Pairs<KeyType, ValueType>
}

export * as LinearIndexMap from "./LinearIndexMap/classes.js"
export * from "./PersistentIndexMap/classes.js"
