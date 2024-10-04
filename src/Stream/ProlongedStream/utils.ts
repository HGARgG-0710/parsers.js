import { isIterableStream } from "../StreamClass/Iterable/utils.js"
import { isNumericPositional } from "../PositionalStream/utils.js"
import { isInputted } from "../UnderStream/utils.js"
import type { ProlongedStream, StreamIndexed } from "./interfaces.js"

import { object, typeof as type, function as _f } from "@hgargg-0710/one"
const { structCheck } = object
const { isNumber } = type
const { and } = _f

export const isStreamIndexed = structCheck<StreamIndexed>({ streamIndex: isNumber })

export const isProlongedStream = and(
	isStreamIndexed,
	isNumericPositional,
	isInputted,
	isIterableStream
) as <Type = any>(x: any) => x is ProlongedStream<Type>
