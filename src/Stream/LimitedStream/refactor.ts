import type { ISupered } from "../../refactor.js"

import type {
	IProddable,
	IWithLookahead,
	ILookaheadHaving,
	IReversedStreamClassInstance,
	IDirectionHaving,
	IDirectionalPosition
} from "../interfaces.js"

import type {
	ILimitedUnderStream,
	ILimitedStreamInitSignature,
	ILimitedStream
} from "./interfaces.js"

export type ILimitedStreamImpl<Type = any> = IProddable<Type> &
	IWithLookahead<Type> &
	ILookaheadHaving &
	ISupered &
	IReversedStreamClassInstance<
		Type,
		ILimitedUnderStream<Type>,
		number,
		ILimitedStreamInitSignature<Type>
	> &
	ILimitedStream<Type> &
	IDirectionHaving & {
		from: IDirectionalPosition
		to: IDirectionalPosition
	}
