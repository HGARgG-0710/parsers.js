import type { BoundNameType } from "src/Stream/StreamClass/refactor.js"
import type { DirectionalPosition, Posed } from "./interfaces.js"
import { direction } from "./utils.js"

export function getStopPoint(pos: DirectionalPosition): BoundNameType {
	return direction(pos) ? "isEnd" : "isStart"
}

export function positionNull(posed: Posed<number>) {
	posed.pos = 0
}

export function positionIncrement(posed: Posed<number>) {
	++posed.pos
}

export function positionDecrement(posed: Posed<number>) {
	--posed.pos
}
