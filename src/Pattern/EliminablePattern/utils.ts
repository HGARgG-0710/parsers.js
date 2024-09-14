import { isFlushable, isPattern, isResulting } from "../utils.js"
import type { Eliminable, EliminablePattern } from "./interfaces.js"

import { object, typeof as type, function as f } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { and } = f

export const isEliminable = structCheck<Eliminable>({ eliminate: isFunction })
export const isEliminablePattern = and(isPattern, isFlushable, isResulting, isEliminable) as (
	x: any
) => x is EliminablePattern
