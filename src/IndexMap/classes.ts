import type { MapClass } from "./interfaces.js"
import { current, firstStream, is } from "src/utils.js"
import { Token } from "src/Pattern/Token/classes.js"

export const [TokenMap, ValueMap, CurrentMap, FirstStreamMap, TypeofMap] = [
	Token.type,
	Token.value,
	current,
	firstStream,
	(x: any) => typeof x
].map((x) => (mapClass: MapClass) => mapClass.extend(x))

export const TypeMap = (mapClass: MapClass) => mapClass.extendKey(is)

export * as HashMap from "./HashMap/classes.js"
export * as LinearIndexMap from "./LinearIndexMap/classes.js"
export * as PersistentIndexMap from "./PersistentIndexMap/classes.js"
