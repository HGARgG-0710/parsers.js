import type { IOwnedStream } from "./OwnedStream.js"

/**
 * This is an interface for representing a handler employed 
 * by the `SingletonStream`. 
*/
export type ISingletonHandler<In = any, Out = any> = (
	resource: IOwnedStream<In>
) => Out
