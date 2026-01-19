import type { IInitializable } from "../interfaces.js"

export interface IPoolable<Args extends any[] = any[]>
	extends IInitializable<Args>, IPoolFriendly {}

export interface IPoolFriendly extends IPoolOwnable, IFreeResettable {}

export interface IPoolOwnable {
	readonly poolId: number
}

export interface IFreeResettable {
	postFree(): void
}
