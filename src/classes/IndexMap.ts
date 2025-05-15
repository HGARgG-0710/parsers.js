import { type as _type } from "@hgargg-0710/one"
import { type } from "src/utils/Node.js"
import type { IMapClass } from "../interfaces/IndexMap.js"
import { resource } from "../utils.js"
import { is } from "../utils/Node.js"
import { current } from "../utils/Stream.js"

const { typeOf } = _type

export const [typeMap, resourceMap, currMap, typeofMap] = [
	type,
	resource,
	current,
	typeOf
].map((x) => (mapClass: IMapClass) => mapClass.extend(x))

export const nodeMap = (mapClass: IMapClass) => mapClass.extendKey(is)

export * from "../IndexMap/classes/MapClass.js"
