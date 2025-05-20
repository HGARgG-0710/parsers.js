import type { ObjectPool } from "../classes.js"

export interface IPoolGetter<T = any> {
	get(key: T): ObjectPool | undefined
}

export interface IFreeable {
	free(poolGetter: IPoolGetter): void
}
