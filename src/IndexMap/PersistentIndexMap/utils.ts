import type { array } from "@hgargg-0710/one"
import type { IMapClass } from "../interfaces.js"
import { PersistentIndexMap } from "./classes.js"

/**
 * Returns a function for creating a `PersistentIndexMap` with the given `mapClass`
 * as the mean for creating the underlying delegate-IndexMap, using the provided `pairs`.
 */
export const fromPairs =
	<KeyType = any, ValueType = any, DefaultType = any>(
		mapClass: IMapClass<KeyType, ValueType>
	) =>
	(pairs: array.Pairs<KeyType, ValueType>, _default?: DefaultType) =>
		new PersistentIndexMap<KeyType, ValueType>(
			new mapClass(pairs, _default)
		)
