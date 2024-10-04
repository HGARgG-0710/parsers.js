import { isStream } from "../BasicStream/utils.js"
import { isIterableStream } from "../StreamClass/Iterable/utils.js"
import { isPositional } from "../PositionalStream/utils.js"
import { isInputted } from "../UnderStream/utils.js"
import type {
	Transformable,
	TransformableStream,
	TransformedStream
} from "./interfaces.js"

import { object, typeof as type, function as _f } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { and } = _f

export const isTransformable = structCheck<Transformable>({ transform: isFunction })

export const isTransformableStream = and(isTransformable, isStream) as (
	x: any
) => x is TransformableStream

export const isTransformedStream = and(
	isTransformable,
	isPositional,
	isInputted,
	isIterableStream
) as (x: any) => x is TransformedStream
