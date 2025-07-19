import { type as _type, string } from "@hgargg-0710/one"
import { is, type } from "../aliases/Node.js"
import { curr, resource } from "../aliases/Stream.js"
import type { ITypeCheckable } from "../interfaces.js"
import type { IIndexMap } from "../interfaces/IndexMap.js"

const { typeOf } = _type

/**
 * Calls and returns `indexMap.extend((x: ITyped<T>) => x.type)`
 */
export const typeMap = <K = any, T = any, Default = any>(
	indexMap: IIndexMap<K, T, Default>
) => indexMap.extend(type)

/**
 * Calls and returns `indexMap.extend((x: IResourceful) => x.resource)`
 */
export const resourceMap = <K = any, T = any, Default = any>(
	indexMap: IIndexMap<K, T, Default>
) => indexMap.extend(resource)

/**
 * Calls and returns `indexMap.extend((x: IStream) => x.curr)`
 */
export const currMap = <K = any, T = any, Default = any>(
	mapClass: IIndexMap<K, T, Default>
) => mapClass.extend(curr)

/**
 * Calls and returns `indexMap.extend((x) => typeof x)`
 */
export const typeofMap = (mapClass: IIndexMap<ReturnType<typeof typeOf>>) =>
	mapClass.extend(typeOf)

/**
 * Calls and returns `mapClass.extendKey((x) => x.is)`
 */
export const nodeMap = <T = any, Default = any>(
	indexMap: IIndexMap<_type.TypePredicate, T, Default>
) => indexMap.extendKey<ITypeCheckable>(is)

/**
 * This is an `IMapClass` without `.change` or `.keyExtension`, which uses
 * `(x: string, i: number) => x.charCodeAt(i)` as an extension.
 * It, thus, expects to have numbers for keys, and `string`s as
 * inputs for the `.index` method.
 */

export const charCodeMap = <K = any, T = any, Default = any>(
	indexMap: IIndexMap<K, T, Default>
) => indexMap.extend(string.charCodeAt)
