import type { Stateful } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isObject } = type

export const isStateful = structCheck<Stateful>({ state: isObject })
