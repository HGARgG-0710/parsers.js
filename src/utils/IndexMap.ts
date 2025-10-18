import { type as _type, string } from "@hgargg-0710/one"
import type {
	IOwnedStream,
	IPredicate,
	IResourceful,
	IStream,
	ITypeCheckable,
	ITyped
} from "../interfaces.js"
import type { IExtendableMap } from "../interfaces/IndexMap.js"
import { peek } from "./Stream.js"

const { typeOf } = _type

/**
 * Calls and returns `indexMap.extend((x: ITyped<T>) => x.type)`
 */
export const TypeMap = <K = any, T = any, Default = any>(
	map: IExtendableMap<K, T, Default>
) => map.extend((x: ITyped) => x.type)

/**
 * Calls and returns `indexMap.extend((x: IResourceful) => x.resource)`
 */
export const ResourceMap = <K = any, T = any, Default = any>(
	map: IExtendableMap<K, T, Default, IOwnedStream>
) => map.extend((x: IResourceful) => x.resource!)

/**
 * Calls and returns `indexMap.extend((x: IStream) => x.curr)`
 */
export const CurrMap = <K = any, T = any, Default = any, Index = any>(
	mapClass: IExtendableMap<K, T, Default, Index>
) => mapClass.extend((x: IStream<Index>) => x.curr)

/**
 * Calls and returns `indexMap.extend((x) => typeof x)`
 */
export const TypeofMap = <T = any, Default = any>(
	map: IExtendableMap<ReturnType<typeof typeOf>, T, Default>
) => map.extend(typeOf)

/**
 * Calls and returns `mapClass.extendKey((x) => x.is)`
 */
export const NodeMap = <T = any, Default = any>(
	map: IExtendableMap<IPredicate, T, Default>
) => map.extendKey<ITypeCheckable>((x) => x.is)

/**
 * This is an `IMapClass` without `.change` or `.keyExtension`, which uses
 * `(x: string, i: number) => x.charCodeAt(i)` as an extension.
 * It, thus, expects to have numbers for keys, and `string`s as
 * inputs for the `.index` method.
 */
export const CharCodeMap = <K = any, T = any, Default = any>(
	map: IExtendableMap<K, T, Default, number>
) => map.extend(string.charCodeAt)

/**
 * This is a function calling `map.extend((x: IPeekable) => x.peek(1))`.
 */
export const PeekMap = <K = any, T = any, Default = any, Index = any>(
	map: IExtendableMap<K, T, Default, Index>
) => map.extend(peek(1))
