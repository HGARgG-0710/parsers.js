import type { IOwnedStream } from "./OwnedStream.js"

export type ISingletonHandler<InType = any, OutType = any> = (
	resource: IOwnedStream<InType>
) => OutType
