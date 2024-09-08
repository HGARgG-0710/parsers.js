import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

import type { IsEndCurrable } from "./interfaces.js"
export const hasIsCurrEnd = structCheck<IsEndCurrable>({ isCurrEnd: isFunction })
