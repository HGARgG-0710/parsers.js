import type { IOwnedStream } from "./OwnedStream.js"

export type IStreamAction<T = any> = (input: IOwnedStream<T>) => void
