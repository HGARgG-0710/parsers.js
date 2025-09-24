import type { ICopiable, IPushable } from "../../../interfaces.js"

/**
 * This interface represents the storage used 
 * by an `AccumulatorStream`. 
*/
export type IStorage<T = any> = IPushable<T> & ICopiable
