import { Pools } from "../global.js"

export abstract class BaseApp<T = any> {
	protected abstract work(): T

	protected cleanup() {
		Pools.All.clear()
	}

	run() {
		const retval = this.work()
		this.cleanup()
		return retval
	}
}
