import type { Posed } from "./interfaces.js"
import { object } from "@hgargg-0710/one"
const { structCheck } = object

export const isPosed = structCheck<Posed>(["pos"])

export * as Position from "./Position/utils.js"
