import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { Rewindable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isRewindable = structCheck<Rewindable>({ rewind: isFunction })
export function rewind(stream: ReversibleStream) {
	while (!stream.isStart) stream.prev()
}
