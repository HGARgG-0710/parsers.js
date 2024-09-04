import type { Limitable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isLimitable = structCheck<Limitable>({ limit: isFunction })
