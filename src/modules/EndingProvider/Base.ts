import type { IEndingProvider } from "../../interfaces/EndingProvider.js"

export abstract class BaseEndingProvider<T = any, Args extends any[] = []>
	implements IEndingProvider<T>
{
	protected ["constructor"]: new (forItem: T, ...args: Args) => this

	abstract isEnd(): boolean

	protected abstract getArgs(): Args

	with(item: T): IEndingProvider<T> {
		return new this.constructor(item, ...this.getArgs())
	}

	constructor(readonly forItem: T) {}
}
