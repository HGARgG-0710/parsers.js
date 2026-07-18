import type { IInitializable } from "../interfaces.js"

export interface IPoolable<Args extends any[] = any[]>
	extends IInitializable<Args>, IPoolFriendly {}

export interface IPoolFriendly extends IPoolOwnable, IFreeResettable {}

export interface IPoolOwnable {
	readonly poolId: number
	readonly isUsed: boolean
	markUsed(): void
	markFree(): void
}

export interface IFreeResettable {
	postFree(): void
}
