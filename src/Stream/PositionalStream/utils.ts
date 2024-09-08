import type { Posed } from "./interfaces.js"
import { object } from "@hgargg-0710/one"
import type { Position } from "./Position/interfaces.js"
const { structCheck } = object

export const isPosed = structCheck<Posed>(["pos"])
export const isPositional = structCheck<Posed<Position>>(["pos"])

export * as Position from "./Position/utils.js"
