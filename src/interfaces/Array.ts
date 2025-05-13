import type {
	IClearable,
	IPushable,
	IReadable,
	ISizeable,
	IWritable
} from "../interfaces.js"

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
