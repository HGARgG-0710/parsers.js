import type { ICopiable } from "../interfaces.js"
import type { IStep, IStepPredicate } from "./Step.js"

/**
 * This is an itnerface for representing an object for
 * accomplishing some manner of property-traversal
 * algorithm that treats `I` as a graph-like recursive
 * object structure, while searching for an item determined
 * by `position` (which can be a predicate, or a numeric
 * value indicating "depth" of traversal, or other some
 * such characteristic).
 */
export interface IPathFollower<I = any, T = any> {
	follow(input: I, step?: IStep<I>): T | undefined
	length(input: I, step?: IStep<I>): number
	setCallback(callback: IPathCallback<I>): void
}

export interface IPropertyPath<I = any> extends ICopiable {
	atIndex(input: I, position: number): [number, any]
	atPredicate(input: I, predicate: IStepPredicate<I>): [number, any]
	setCallback(callback: IPathCallback<I>): void
}

export type IPathCallback<I = any> = (input: I, x: any) => void
