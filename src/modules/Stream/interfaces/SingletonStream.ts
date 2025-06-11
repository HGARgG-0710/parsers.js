import type { IOwnedStream } from "./OwnedStream.js"

export type ISingletonHandler<In = any, Out = any> = (
	resource: IOwnedStream<In>
) => Out
