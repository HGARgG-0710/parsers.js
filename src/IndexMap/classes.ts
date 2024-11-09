import type { MapClass } from "./interfaces.js"
import { type } from "src/Token/utils.js"
import { value } from "src/Pattern/utils.js"
import { current, is } from "../utils.js"

import { typeof as _typeof } from "@hgargg-0710/one"
const { typeOf } = _typeof

export const [TokenMap, ValueMap, CurrentMap, TypeofMap] = [
	type,
	value,
	current,
	typeOf
].map((x) => (mapClass: MapClass) => mapClass.extend(x))

export const TypeMap = (mapClass: MapClass) => mapClass.extendKey(is)

export * as FastLookupTable from "./FastLookupTable/classes.js"
export * as HashMap from "./HashMap/classes.js"
export * as LinearIndexMap from "./LinearIndexMap/classes.js"

export * from "./PersistentIndexMap/classes.js"
