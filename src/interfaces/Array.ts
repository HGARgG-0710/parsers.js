import type {
	ISizeable,
	IWritable,
	IPushable,
	IReadable
} from "../interfaces.js"

export interface IArray<T = any>
	extends ISizeable,
		IWritable<T>,
		IPushable<T>,
		IReadable<T> {
	shift(count?: number): this
	unshift(...values: T[]): this
	remove(index: number, count?: number): this
	insert(index: number, ...values: T[]): this
	pop(count?: number): this
}
