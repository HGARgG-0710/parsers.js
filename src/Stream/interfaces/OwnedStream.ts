import type { IStream } from "../interfaces.js"

export type IOwnedStream<Type = any> = IStream<Type> & {
	readonly owner?: IStream<Type>
	claimBy(owner: IStream<Type>): void
}
