import { type as _type } from "@hgargg-0710/one"
import { is, type } from "../aliases/Node.js"
import { curr, resource } from "../aliases/Stream.js"
import type { IResourcefulStream, IStream, ITyped } from "../interfaces.js"
import type { IMapClass } from "../interfaces/MapClass.js"

const { typeOf } = _type

/**
 * Calls and returns `mapClass.extend((x: ITyped<T>) => x.type)`
 */
export const typeMap = <T = any>(mapClass: IMapClass<T>) =>
	mapClass.extend<ITyped<T>>(type)

/**
 * Calls and returns `mapClass.extend((x: IResourcefulStream) => x.resource)`
 */
export const resourceMap = (mapClass: IMapClass) =>
	mapClass.extend<IResourcefulStream>(resource)

/**
 * Calls and returns `mapClass.extend((x: IStream) => x.curr)`
 */
export const currMap = <T = any>(mapClass: IMapClass<T>) =>
	mapClass.extend<IStream<T>>(curr)

/**
 * Calls and returns `mapClass.extend((x) => typeof x)`
 */
export const typeofMap = (mapClass: IMapClass<ReturnType<typeof typeOf>>) =>
	mapClass.extend(typeOf)

/**
 * Calls and returns `mapClass.extendKey((x) => x.is)`
 */
export const nodeMap = (mapClass: IMapClass) => mapClass.extendKey(is)

export * from "../modules/IndexMap/classes/MapClass.js"
export * from "../modules/IndexMap/classes/ModifiableMap.js"
