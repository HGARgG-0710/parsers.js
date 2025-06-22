/**
 * An object used for initializing other objects.
 * Mostly untyped, intended to be used on bare-bone objects,
 * to create reusable initialization logic and not classes.
 */
export interface IInitializer<Args extends any[] = any[]> {
	init(target: unknown, ...args: Partial<Args> | []): void
}

/**
 * An object with a `.setResource` public setter method.
 */
export interface IResourceSettable<T = unknown> {
	setResource(newResource: T): void
}

/**
 * An object with a '.setOwner' public setter method
 */
export interface IOwnerSettable<T = unknown> {
	setOwner(newOwner: T): void
}
