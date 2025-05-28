export interface IInitializer<Args extends any[] = any[]> {
	init(target: unknown, ...args: Partial<Args>): void
}

export interface IResourceSettable {
	setResource(newResource?: unknown): void
}

export interface IOwnerSettable {
	setOwner(newOwner?: unknown): void
}
