import { TerminalMap } from "../classes/HashMap.js"
import {
	PlainArray,
	PlainMap,
	PlainObject
} from "../modules/HashMap/classes/PlainMap.js"

import { Pairs } from "./Pairs.js"

export function ObjectMap<T = any, Default = any>(
	object?: object,
	_default?: Default
) {
	return new TerminalMap(new PlainObject<T>(object), _default)
}

export function ArrayMap<T = any, Default = any>(
	pairs: Iterable<[number, T]> = [],
	_default?: Default
) {
	return new TerminalMap(new PlainArray(Pairs.toArray(pairs)), _default)
}

export function BasicMap<K = any, V = any, Default = any>(
	pairs: Iterable<[K, V]> = [],
	_default?: Default
) {
	return new TerminalMap(new PlainMap(new Map(pairs)), _default)
}
