import { type as _type } from "@hgargg-0710/one"
import { type } from "src/Node/utils.js"
import { is } from "../Node/utils.js"
import { current } from "../Stream/utils.js"
import { resource } from "../utils.js"
import type { IMapClass } from "./interfaces.js"

const { typeOf } = _type

export const [typeMap, resourceMap, currMap, typeofMap] = [
	type,
	resource,
	current,
	typeOf
].map((x) => (mapClass: IMapClass) => mapClass.extend(x))

export const nodeMap = (mapClass: IMapClass) => mapClass.extendKey(is)

export * from "./classes/MapClass.js"
