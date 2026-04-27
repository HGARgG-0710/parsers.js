export interface IStringConvertible {
	toString(): string
}

export interface INumericConvertible {
	valueOf(): number
}

export interface IIndexLikeObject
	extends INumericConvertible, IStringConvertible {}

export type IIndexLike = IIndexLikeObject | number
