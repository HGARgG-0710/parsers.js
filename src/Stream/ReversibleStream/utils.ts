import type { Started } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isBoolean } = type

export const isStarted = structCheck<Started>({ isStart: isBoolean })
