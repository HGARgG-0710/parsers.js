import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

import type { Nestable } from "./interfaces.js"

export const isNestable = structCheck<Nestable>({ nest: isFunction })
