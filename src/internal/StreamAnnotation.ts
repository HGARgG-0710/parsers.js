import type { IStream, IInitializable } from "../interfaces.js"

export abstract class StreamAnnotation<T = any, Args extends any[] = any[]>
	implements IStream<T>, IInitializable<Args>
{
	abstract readonly isEnd: boolean
	abstract readonly isStart: boolean
	abstract readonly curr: T

	abstract next(): void
	abstract isCurrEnd(): boolean
	abstract copy(): this

	init(...x: Partial<Args>): this {
		return this
	}

	abstract [Symbol.iterator](): Generator<T>

	constructor(...x: Partial<Args>) {}
}
