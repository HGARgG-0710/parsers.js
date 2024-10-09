import { Token } from "./classes.js"
import type { TokenInstance } from "./interfaces.js"

import { object, function as f } from "@hgargg-0710/one"
const { and } = f
const { structCheck } = object

const emptyStruct = structCheck([])
export function isType<Type = any>(type: Type): (x: any) => x is TokenInstance<Type> {
	return and(emptyStruct, (x: any): boolean => Token.type(x) === type) as (
		x: any
	) => x is TokenInstance<Type>
}
