import type { IPeekable } from "../../../interfaces.js"
import type { ILinkedStream } from "./OwnedStream.js"

/**
 * This is an `ILinkedStream<T>`, which is also `IPeekable<T>`. 
*/
export type IPeekStream<T = any> = ILinkedStream<T> & IPeekable<T>
