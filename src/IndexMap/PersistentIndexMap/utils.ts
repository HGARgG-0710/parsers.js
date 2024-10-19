import type { MapClass, Pairs } from "../interfaces.js"
import { PersistentIndexMap } from "./classes.js"

export const fromPairsList =
	<KeyType = any, ValueType = any>(mapClass: MapClass<KeyType, ValueType>) =>
	(pairs: Pairs<KeyType, ValueType>) =>
		new PersistentIndexMap<KeyType, ValueType>(new mapClass(pairs))
