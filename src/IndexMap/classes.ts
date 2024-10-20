import type { MapClass } from "./interfaces.js"
import { current, firstStream, is } from "../utils.js"
import { Token } from "../Pattern/Token/classes.js"
import { typeof as type } from "@hgargg-0710/one"
const { typeOf } = type

export const [TokenMap, ValueMap, CurrentMap, FirstStreamMap, TypeofMap] = [
	Token.type,
	Token.value,
	current,
	firstStream,
	typeOf
].map((x) => (mapClass: MapClass) => mapClass.extend(x))

export const TypeMap = (mapClass: MapClass) => mapClass.extendKey(is)

export * as SubHaving from "./SubHaving/classes.js"
export * as FastLookupTable from "./FastLookupTable/classes.js"
export * as HashMap from "./HashMap/classes.js"
export * as LinearIndexMap from "./LinearIndexMap/classes.js"
export * as PersistentIndexMap from "./PersistentIndexMap/classes.js"
