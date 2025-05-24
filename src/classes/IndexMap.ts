import { type as _type } from "@hgargg-0710/one"
import { type } from "src/aliases/Node.js"
import type { IMapClass } from "../interfaces/IndexMap.js"
import { resource } from "src/aliases/Stream.js"
import { is } from "src/aliases/Node.js"
import { curr} from "src/aliases/Stream.js"

const { typeOf } = _type

export const [typeMap, resourceMap, currMap, typeofMap] = [
	type,
	resource,
	curr,
	typeOf
].map((x) => (mapClass: IMapClass) => mapClass.extend(x))

export const nodeMap = (mapClass: IMapClass) => mapClass.extendKey(is)

export * from "../modules/IndexMap/classes/MapClass.js"
