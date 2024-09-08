import { object } from "@hgargg-0710/one"
import type { Inputted } from "./interfaces.js"
const { structCheck } = object
export const isInputted = structCheck<Inputted>(["input"])
