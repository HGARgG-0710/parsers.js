import { function as _f } from "@hgargg-0710/one"
import { isInputted } from "../UnderStream/utils.js"
import { isPositionalStream } from "../PositionalStream/utils.js"
import { isBasicReversibleStream } from "../ReversibleStream/utils.js"
import type { TreeStream } from "./interfaces.js"
import { isIterable } from "../StreamClass/Iterable/utils.js"
const { and } = _f

export const isTreeStream = and(
	isInputted,
	isIterable,
	isPositionalStream,
	isBasicReversibleStream
) as (x: any) => x is TreeStream
