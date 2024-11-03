import type { MapClass } from "./interfaces.js"
import { type } from "src/Pattern/Token/utils.js"
import { value } from "src/Pattern/utils.js"
import { current, firstStream, is } from "../utils.js"

import { typeof as _typeof } from "@hgargg-0710/one"
const { typeOf } = _typeof

export const [TokenMap, ValueMap, CurrentMap, FirstStreamMap, TypeofMap] = [
	type,
	value,
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
