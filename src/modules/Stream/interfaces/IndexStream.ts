import type { ILineIndex } from "../../../interfaces.js"
import type { ILinkedStream } from "./OwnedStream.js"

/**
 * This is an `ILinkedStream<T>`, supplemented with an 
 * `readonly lineIndex: ILineIndex` property, which is 
 * intended to keep track of the stream's current 
 * line-character (which do not necesserily have to mean a 
 * string). 
*/
export type IIndexStream<T = any> = ILinkedStream<T> & IIndexCarrying

/**
 * Type for representing entitites that carry 
 * a `readonly .lineIndex: ILineIndex` property. 
*/
export type IIndexCarrying = {
	readonly lineIndex: ILineIndex
}