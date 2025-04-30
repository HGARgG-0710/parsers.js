import type { array } from "@hgargg-0710/one"
import { type as _type } from "@hgargg-0710/one"
import { type } from "src/Node/utils.js"
import { is } from "../Node/utils.js"
import { current } from "../Stream/utils.js"
import { resource } from "../utils.js"
import type { ILinearMapClass } from "./interfaces.js"

const { typeOf, isNumber } = _type

export const [TokenMap, ValueMap, CurrentMap, TypeofMap] = [
	type,
	resource,
	current,
	typeOf
].map((x) => (mapClass: ILinearMapClass) => mapClass.extend(x))

export const TypeMap = (mapClass: ILinearMapClass) => mapClass.extendKey(is)

export const Pairs = <KeyType = any, ValueType = any>(
	...pairs: array.Pairs<KeyType, ValueType> | [number]
) => {
	const n = pairs[0]
	return (
		isNumber(n) ? Array.from({ length: n }, () => new Array(2)) : pairs
	) as array.Pairs<KeyType, ValueType>
}

export * as LinearIndexMap from "./LinearIndexMap/classes.js"
