import type { Collection } from "./interfaces.js"
import { SelfAssignmentClass } from "../utils.js"

import { defaults } from "../constants.js"
const { DefaultValue } = defaults.ArrayCollection

export const ArrayCollection = SelfAssignmentClass<any[], Collection>(
	"value",
	DefaultValue
) as <Type = any>(x?: Type[]) => Collection<Type>

export * as Buffer from "./Buffer/classes.js"
