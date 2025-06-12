import type { ObjectPool } from "../classes.js"

export interface IPoolGetter<T = any> {
	get(key: T): ObjectPool | undefined
}

export interface IFreeable<T = any> {
	free(poolGetter: IPoolGetter<T>): void
}
