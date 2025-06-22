import type { ObjectPool } from "../classes.js"

/**
 * This is an interface for a basic read-only collection 
 * of `ObjectPool`s. Upon having given an inexistent key 
 * `key: T`, `undefined` is returned. 
*/
export interface IPoolGetter<T = any> {
	get(key: T): ObjectPool | undefined
}

/**
 * This is an interface representing an object that 
 * can be pool-freed (and then - reused), with the 
 * help of a given `IPoolGetter<T>`. The `poolGetter` 
 * is intended to provide external pool to be employed, 
 * while the `.free(poolGetter: IPoolGetter<T>): void` 
 * method is intended to contain the actual freeing logic. 
*/
export interface IFreeable<T = any> {
	free(poolGetter: IPoolGetter<T>): void
}
