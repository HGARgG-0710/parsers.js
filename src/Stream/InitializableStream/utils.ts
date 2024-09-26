import type { Initializable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isInitializable = structCheck<Initializable>({ init: isFunction })
