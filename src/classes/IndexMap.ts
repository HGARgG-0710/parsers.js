import { type as _type } from "@hgargg-0710/one"
import { is, type } from "../aliases/Node.js"
import { curr, resource } from "../aliases/Stream.js"
import type { IResourcefulStream, IStream, ITyped } from "../interfaces.js"
import type { IMapClass } from "../interfaces/IndexMap.js"

const { typeOf } = _type

export const typeMap = (mapClass: IMapClass) => mapClass.extend<ITyped>(type)

export const resourceMap = (mapClass: IMapClass) =>
	mapClass.extend<IResourcefulStream>(resource)

export const currMap = (mapClass: IMapClass) => mapClass.extend<IStream>(curr)

export const typeofMap = (mapClass: IMapClass) => mapClass.extend(typeOf)

export const nodeMap = (mapClass: IMapClass) => mapClass.extendKey(is)

export * from "../modules/IndexMap/classes/MapClass.js"
