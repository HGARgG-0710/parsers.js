import type { TokenInstance } from "./interfaces.js"
import { typeof as type } from "@hgargg-0710/one"
const { isObject } = type

export function isType<Type = any>(type: Type) {
	return (x: any): x is TokenInstance<Type> =>
		x && isObject<TokenInstance<Type>>(x) && x.type === type
}
