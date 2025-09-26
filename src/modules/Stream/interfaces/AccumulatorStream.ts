import type { ICommonStream, ICopiable, IPushable } from "../../../interfaces.js"

/**
 * This interface represents the storage used 
 * by an `AccumulatorStream`. 
*/
export type IStorage<T = any> = IPushable<T> & ICopiable

/**
 * This is an interface for representing the stream 
 * capable of accumulating values inside its own 
 * `readonly storage: IStorage<T>` object. 
*/
export interface IAccumulatorStream<T = any> extends ICommonStream<T> {
	readonly storage: IStorage<T>
}