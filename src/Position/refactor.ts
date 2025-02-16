import type { BoundNameType } from "../Stream/StreamClass/interfaces.js"
import type { DirectionalPosition, Posed } from "./interfaces.js"

import { isBackward } from "./utils.js"

export function getStopPoint(pos: DirectionalPosition): BoundNameType {
	return isBackward(pos) ? "isStart" : "isEnd"
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
