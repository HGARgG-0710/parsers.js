import type { Started } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
import type { Prevable } from "./interfaces.js"
const { structCheck } = object
const { isBoolean, isFunction } = type

export const isStarted = structCheck<Started>({ isStart: isBoolean })
export const isPrevable = structCheck<Prevable>({ prev: isFunction })
