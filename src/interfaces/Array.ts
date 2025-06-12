import type {
	IClearable,
	IPushable,
	IReadable,
	ISizeable,
	IWritable
} from "../interfaces.js"

/**
 * This is an interface that is intended to 
 * represent a host of various operations, 
 * serving as a form of wrapper around 
 * the builtin `Array`, or a similar structure. 
 * It provides the user with complete and 
 * (generally) persistent read-write access
 * to the internal collection of items of 
 * type `T`. 
*/
export interface IArray<T = any>
	extends ISizeable,
		IWritable<T>,
		IPushable<T>,
		IReadable<T>,
		IClearable {
	shift(count?: number): this
	unshift(...values: T[]): this
	remove(index: number, count?: number): this
	insert(index: number, ...values: T[]): this
	pop(count?: number): this
	each(callback: (x: T) => void): this
	fill(newItems: T[]): this
}
