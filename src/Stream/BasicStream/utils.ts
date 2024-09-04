import { object, typeof as type, function as f } from "@hgargg-0710/one"
const { structCheck } = object
const { isBoolean } = type
const { and } = f

import { isNextable } from "../utils.js"
import { isCurrable } from "../PreBasicStream/utils.js"
import type { Endable } from "../PreBasicStream/interfaces.js"
import type { BasicStream } from "./interfaces.js"

export const isEndable = structCheck<Endable>({ isEnd: isBoolean })
export const isStream: (x: any) => x is BasicStream = and(
	isEndable,
	isCurrable,
	isNextable
) as (x: any) => x is BasicStream
