import type { IInitializable } from "../interfaces.js"

export interface IPoolable<Args extends any[] = any[]>
	extends IInitializable<Args>, IPoolOwned {}

export interface IPoolOwned {
	readonly poolId: number
}
