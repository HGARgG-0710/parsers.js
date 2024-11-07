import type { Collection } from "./interfaces.js"
import { SelfAssignmentClass } from "../utils.js"

export const ArrayCollection = SelfAssignmentClass<any[], Collection>("value", []) as <
	Type = any
>(
	x?: Type[]
) => Collection<Type>

export * as Buffer from "./Buffer/classes.js"
