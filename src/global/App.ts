import { Pools } from "../global.js"

export abstract class BaseApp<T = any, Args extends any[] = []> {
	protected init(...args: Args) {}

	protected abstract work(...args: Args): T

	protected cleanup(...args: Args) {
		Pools.All.clear()
	}

	run(...args: Args) {
		this.init(...args)
		const retval = this.work(...args)
		this.cleanup(...args)
		return retval
	}
}

export class WrapperApp<T = any, Args extends any[] = []> extends BaseApp<
	T,
	Args
> {
	protected override work(...args: Args): T {
		return this.workInjected(...args)
	}

	constructor(private readonly workInjected: (...args: Args) => T) {
		super()
	}
}
