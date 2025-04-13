import type { IProddable, IReversibleStream } from "../../interfaces.js"
import type { IPredicatePosition } from "../Position/interfaces.js"
import type { IPattern } from "src/interfaces.js"

import type { IIsEndCurrable } from "../../interfaces.js"
import type { IStreamClassInstance } from "../StreamClass/interfaces.js"

import type { ICopiable, IFreezableBuffer, ISupered } from "../../interfaces.js"
import type { IWithLookahead } from "../interfaces.js"
import type { ILookaheadHaving } from "../interfaces.js"

export type IUnderPredicateStream<Type = any> = IReversibleStream<Type> &
	IIsEndCurrable &
	ICopiable

export type IPredicateStreamInitSignature<Type = any> = [
	IUnderPredicateStream<Type>?,
	IFreezableBuffer<Type>?
]

export type IPredicateStream<Type = any> = IStreamClassInstance<
	Type,
	IUnderPredicateStream<Type>,
	number,
	IPredicateStreamInitSignature<Type>
> &
	ISupered &
	IProddable<Type> &
	IWithLookahead<Type> &
	IPattern<IUnderPredicateStream<Type>> &
	ILookaheadHaving & {
		predicate: IPredicatePosition<Type>
	}

export type IPredicateStreamConstructor<Type = any> = new (
	value?: IUnderPredicateStream,
	buffer?: IFreezableBuffer<Type>
) => IPredicateStream<Type>
