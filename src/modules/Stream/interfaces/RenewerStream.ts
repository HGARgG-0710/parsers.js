import type { IOwningStream } from "./OwnedStream.js"

/**
 * This is an interface representing an `IOwningStream<T>`,
 * capable of "reviving" its dead child-stream (the `.resource: IOwnedStream`)
 * via the call of `reviveChild(): boolean`, which returns
 * whether or not the revival procedure was successful (in event that
 * it is, the `.resource.isEnd` is no longer true, otherwise no change
 * in its state ocurrs).
 */
export interface IRenewerStream<T = any> extends IOwningStream<T> {
	reviveChild(): boolean
}
