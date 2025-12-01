import { Pools } from "../global.js"

export abstract class BaseApp<T = any> {
	protected init() {}

	protected abstract work(): T

	protected cleanup() {
		Pools.All.clear()
	}

	run() {
		this.init()
		const retval = this.work()
		this.cleanup()
		return retval
	}
}
