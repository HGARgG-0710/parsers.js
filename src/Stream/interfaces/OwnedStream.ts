import type { IResourceful, IStream } from "../interfaces.js"

export type IOwnedStream<Type = any> = IStream<Type> & {
	readonly owner?: unknown
	claimBy(owner: unknown): void
}

export type IRecursiveStream<Type = any> = IOwnedStream<Type> & IResourceful
