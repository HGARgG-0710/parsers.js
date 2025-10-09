import type { IStream } from "../../../interfaces.js"

/**
 * This is an object carrying an item `readonly marker: M`.
 */
export interface IMarkerHaving<M = any> {
	readonly marker: M
}

/**
 * This is an `IStream<T>`, which is also an `IMarkerHaving<M>`.
 */
export interface IMarkerStream<T = any, M = any>
	extends IStream<T>,
		IMarkerHaving<M> {}

/**
 * Represents a factory-function for the marker-type `M`
 * used by the respective `IMarkerStream<T>`.
 */
export type IMarkerMaker<T = any, M = any> = (stream: IMarkerStream<T>) => M
