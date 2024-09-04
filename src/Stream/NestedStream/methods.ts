import { NestedSteam } from "./classes.js"
import type { BaseNestableStream, InflationPredicate } from "./interfaces.js"

import { boolean } from "@hgargg-0710/one"
const { F } = boolean

export function baseNestableStreamNest<Type = any>(
	this: BaseNestableStream<Type>,
	inflate: InflationPredicate = F,
	deflate: InflationPredicate = F
) {
	return NestedSteam<Type>(this, inflate, deflate)
}
