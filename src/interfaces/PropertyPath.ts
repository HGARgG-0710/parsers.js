import type { IPosition } from "./Position.js"

/**
 * This is an itnerface for representing an object for 
 * accomplishing some manner of property-traversal 
 * algorithm that treats `I` as a graph-like recursive 
 * object structure, while searching for an item determined 
 * by `position` (which can be a predicate, or a numeric 
 * value indicating "depth" of traversal, or other some 
 * such characteristic). 
*/
export interface IPropertyPath<I = any, T = any> {
	follow(input: I, position: IPosition<I>): T | undefined
}
