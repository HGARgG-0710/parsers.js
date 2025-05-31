import { type as _type } from "@hgargg-0710/one"
import { is, type } from "../aliases/Node.js"
import { curr, resource } from "../aliases/Stream.js"
import type { IMapClass } from "../interfaces/IndexMap.js"

const { typeOf } = _type

export const [typeMap, resourceMap, currMap, typeofMap] = [
	type,
	resource,
	curr,
	typeOf
].map((x) => (mapClass: IMapClass) => mapClass.extend(x))

export const nodeMap = (mapClass: IMapClass) => mapClass.extendKey(is)

export * from "../modules/IndexMap/classes/MapClass.js"
