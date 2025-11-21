import type { IControlStream, ILinkedStream } from "./OwnedStream.js"

/**
 * This is an interface for representing the most common
 * library stream. It is usable as an in-parser stream,
 * since it is an `ILinkedStream<T>`, it is `Iterable<T>`,
 * and `ICopiable` (the operation is implemented for testing
 * purposes).
 */
export type ICommonStream<T = any> = ILinkedStream<T> & Iterable<T>

export type ICommandStream<T = any> = IControlStream<T> & ICommonStream<T>
