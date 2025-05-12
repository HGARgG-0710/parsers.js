export interface IInitializer {
	init(target: unknown, ...args: any[]): void
}

export interface IResourceSettable {
	setResource(newResource?: unknown): void
}

export interface IOwnerSettable {
	setOwner(newOwner?: unknown): void
}
