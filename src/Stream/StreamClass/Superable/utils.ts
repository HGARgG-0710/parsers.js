import { object } from "@hgargg-0710/one"
import type { Superable } from "./interfaces.js"
const { structCheck } = object
export const isSuperable = structCheck<Superable>(["super"])
