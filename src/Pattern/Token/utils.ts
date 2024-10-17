import type { Summat } from "@hgargg-0710/summat.ts"
import type { TokenInstance } from "./interfaces.js"

import { typeof as type } from "@hgargg-0710/one"
const { isObject } = type

export function isType<Type = any>(type: Type) {
	return (x: any): x is TokenInstance<Type> =>
		x && isObject(x) && (x as Summat).type === type
}
