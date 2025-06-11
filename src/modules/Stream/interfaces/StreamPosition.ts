import type {
	IPosition,
	IPredicatePosition,
	IStream
} from "../../../interfaces.js"

/**
 * This is `IPosition<IStream<T>>`, specific to library's stream objects.
 */
export type IStreamPosition<T = any> = IPosition<IStream<T>>

/**
 * This is `IPredicatePosition<IStream<T>>` - a specifica case with an (optional)
 * `direction?: boolean` property.
 */
export type IStreamPositionPredicate<T = any> = IPredicatePosition<
	IStream<T>
> & {
	direction?: boolean
}
