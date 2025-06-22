import type { IOwnedStream } from "./OwnedStream.js"

/**
 * This is a type representing a handler function
 * passed to a `HandlerStream` for creation of a
 * class for producing `IControlStream<Out>`s from
 * a `resource: ILinkedStream<In>`.
 */
export type IHandler<In = any, Out = any> = (stream: IOwnedStream<In>) => Out
