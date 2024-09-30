import type { SummatIterable } from "@hgargg-0710/summat.ts"
import type { IterableStream } from "./interfaces.js"
import { isStream } from "../BasicStream/utils.js"

import { object, function as f } from "@hgargg-0710/one"
const { and } = f
const { structCheck } = object

export const isIterable = structCheck<SummatIterable>([Symbol.iterator])
export const isIterableStream = and(isIterable, isStream) as (
	x: any
) => x is IterableStream
