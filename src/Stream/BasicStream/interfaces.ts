import type {
	Nextable,
	IsEndCurrable,
	IsStartCurrable,
	BaseNextable
} from "../interfaces.js"
import type { PreBasicStream } from "../PreBasicStream/interfaces.js"

export interface BasicStream<Type = any> extends PreBasicStream<Type>, Nextable<Type> {}
export interface BaseStream<Type = any> extends BasicStream<Type>, IsEndCurrable {}
export interface ReverseBaseStream<Type = any>
	extends BasicStream<Type>,
		IsStartCurrable {}

export interface EssentialStream<Type = any>
	extends BaseStream<Type>,
		BaseNextable<Type> {}
