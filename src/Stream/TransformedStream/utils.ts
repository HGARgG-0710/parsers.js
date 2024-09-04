import type { Transformable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isTransformable = structCheck<Transformable>({ transform: isFunction })
