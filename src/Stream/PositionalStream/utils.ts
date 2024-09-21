import type { PositionalStream, Posed } from "./interfaces.js"
import type { Position } from "./Position/interfaces.js"

import { object, function as _f, typeof as type } from "@hgargg-0710/one"
import { isPosition } from "./Position/utils.js"
import { isIterableStream } from "../IterableStream/utils.js"
const { structCheck } = object
const { and } = _f
const { isNumber } = type

export const isPosed = structCheck<Posed>(["pos"])
export const isNumericPositional = structCheck<Posed<number>>({ pos: isNumber })
export const isPositional = structCheck<Posed<Position>>({ pos: isPosition })

export const isPositionalStream = and(isPositional, isIterableStream) as (
	x: any
) => x is PositionalStream

export * as Position from "./Position/utils.js"
