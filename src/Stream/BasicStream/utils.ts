import { object, typeof as type, function as f } from "@hgargg-0710/one"
const { structCheck } = object
const { isBoolean } = type
const { and } = f

import type { Currable, Endable, BasicStream, Nextable } from "./interfaces.js"

export const isCurrable = structCheck<Currable>(["curr"])

export const isEndable = structCheck<Endable>({ isEnd: isBoolean })
export const isStream: (x: any) => x is BasicStream = and(
	isEndable,
	isCurrable,
	isNextable
) as (x: any) => x is BasicStreamexport const isNextable = structCheck<Nextable>({ next: isFunction })

