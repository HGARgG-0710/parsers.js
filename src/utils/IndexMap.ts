import { type as _type } from "@hgargg-0710/one"
import type {
	IOwnedStream,
	IPredicate,
	IResourceful,
	IStream,
	ITypeCheckable,
	ITyped,
	IValidNodeType
} from "../interfaces.js"
import type { IMapExtender } from "../interfaces/IndexMap.js"
import { peek } from "./Stream.js"

const { typeOf } = _type

/**
 * Calls and returns `indexMap.extend((x: ITyped<T>) => x.type)`
 */
export const TypeMap = <T = any, Default = any>(
	map: IMapExtender<IValidNodeType, T, Default>
) => map.extend((x: ITyped) => x.type)

/**
 * Calls and returns `indexMap.extend((x: IResourceful) => x.resource)`
 */
export const ResourceMap = <K = any, T = any, Default = any>(
	map: IMapExtender<K, T, Default, IOwnedStream>
) => map.extend((x: IResourceful) => x.resource!)

/**
 * Calls and returns `indexMap.extend((x: IStream) => x.curr)`
 */
export const CurrMap = <K = any, T = any, Default = any, Index = any>(
	mapClass: IMapExtender<K, T, Default, Index>
) => mapClass.extend((x: IStream<Index>) => x.curr)

/**
 * Calls and returns `indexMap.extend((x) => typeof x)`
 */
export const StringTypeMap = <T = any, Default = any>(
	map: IMapExtender<ReturnType<typeof typeOf>, T, Default>
) => map.extend(typeOf)

/**
 * Calls and returns `mapClass.extendKey((x) => x.is)`
 */
export const NodeMap = <T = any, Default = any>(
	map: IMapExtender<IPredicate, T, Default>
) => map.extendKey<ITypeCheckable>((x) => x.is)

/**
 * This is a function calling `map.extend((x: IPeekable) => x.peek(1))`.
 */
export const PeekMap = <K = any, T = any, Default = any, Index = any>(
	map: IMapExtender<K, T, Default, Index>
) => map.extend(peek(1))
