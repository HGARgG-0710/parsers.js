import type { BaseIterable, BoundCheckable } from "../interfaces.js"
import type { BasicStream } from "../BasicStream/interfaces.js"

export type CommonStream<Type = any> = BasicStream<Type> &
	BoundCheckable &
	BaseIterable<Type>

export type IterCheckPropNameType = "isCurrEnd" | "isCurrStart"
export type BaseIterPropNameType = "baseNext" | "basePrev"
export type IterPropNameType = "next" | "prev"
export type BoundNameType = "isEnd" | "isStart"
