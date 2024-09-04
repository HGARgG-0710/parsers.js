import { object, function as f } from "@hgargg-0710/one"
const { and } = f
const { structCheck } = object

import { Token } from "./classes.js"
import type { TokenInstance } from "./interfaces.js"
import type { SummatIterable } from "@hgargg-0710/summat.ts"

const emptyStruct = structCheck([])
export function isType<Type = any>(type: Type): (x: any) => x is TokenInstance<Type> {
	return and(emptyStruct, (x: any): boolean => Token.type(x) === type) as (
		x: any
	) => x is TokenInstance<Type>
}

export const iteratorCheck = structCheck<SummatIterable>([Symbol.iterator])
