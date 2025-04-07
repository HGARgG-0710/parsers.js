import type { IReversibleStream } from "../interfaces.js"
import type { IStream } from "../interfaces.js"

export type IPosition<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> =
	| IDirectionalPosition<Type, SubType, PosType>
	| IPositionObject<Type, SubType, PosType>

export type IDirectionalPosition<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IPredicatePosition<Type, SubType, PosType> | number

export type IPredicatePosition<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = ((
	stream: IStream<Type, SubType, PosType>,
	pos?: IPosition<Type, SubType, PosType>
) => boolean) &
	Partial<IDirectionHaving>

export interface IPositionObject<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> {
	equals?: (position: IPosition<Type, SubType, PosType>) => boolean

	convert: (
		stream?: IStream<Type, SubType, PosType>
	) => IDirectionalPosition<Type, SubType, PosType>

	compare?: (
		position: IPosition<Type, SubType, PosType>,
		stream?: IStream<Type, SubType, PosType>
	) => boolean
}

export interface IPosed<Type = any> {
	pos: Type
}

export type IChange<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = (input: IReversibleStream<Type, SubType, PosType>) => Type

export interface IDirectionHaving {
	direction: boolean
}
