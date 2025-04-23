import type { IDirectionalPosition, IPosed } from "./interfaces.js"
import { direction } from "./utils.js"

export function getStopPoint(pos: IDirectionalPosition) {
	return direction(pos) ? "isEnd" : "isStart"
}

export function positionNull(posed: IPosed<number>) {
	posed.pos = 0
}

export function positionIncrement(posed: IPosed<number>) {
	++posed.pos
}

export function positionDecrement(posed: IPosed<number>) {
	--posed.pos
}
