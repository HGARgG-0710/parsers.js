import type { MapClass } from "../interfaces.js"
import type { array } from "@hgargg-0710/one"

import { PersistentIndexMap } from "./classes.js"

export const fromPairs =
	<KeyType = any, ValueType = any>(mapClass: MapClass<KeyType, ValueType>) =>
	(pairs: array.Pairs<KeyType, ValueType>) =>
		new PersistentIndexMap<KeyType, ValueType>(new mapClass(pairs))
