/**
 * An object used for initializing other objects.
 * Mostly untyped, intended to be used on bare-bone objects,
 * to create reusable initialization logic and not classes.
 */
export interface IInitializer<Args extends any[] = any[]> {
	init(target: unknown, ...args: Partial<Args> | []): void
}

export interface IBaseInitializable {
	baseInit(): void
}

/**
 * An object with a `.connectResource` public setter method.
 */
export interface IResourceConnectable<T = unknown> extends IBaseInitializable {
	connectResource(resource: T): void
}

/**
 * An object with a '.connectOwner' public setter method
 */
export interface IOwnerConnectable<T = unknown> {
	connectOwner(newOwner: T): void
}
