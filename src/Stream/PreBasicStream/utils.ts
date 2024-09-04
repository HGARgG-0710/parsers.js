import type { Currable } from "./interfaces.js"
import { object } from "@hgargg-0710/one"
const { structCheck } = object

export const isCurrable = structCheck<Currable>(["curr"])
