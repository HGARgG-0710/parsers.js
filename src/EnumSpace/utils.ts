import type { IEnumSpace } from "./interfaces.js"
import type { IMappable } from "../interfaces.js"

import { functional } from "@hgargg-0710/one"
const { trivialCompose } = functional

/**
 * Returns a function mapping `enums` using `f`
 */
export const fromEnum =
	<T = any, Type = any>(f?: IMappable<T, Type>) =>
	(enums: IEnumSpace<T>) =>
		enums.map(f)

/**
 * Returns a function for returning a generator
 * based off a given collection of items.
 */
export const fromItems =
	<Type = any>(...items: Type[]) =>
	(i: number) =>
		items[i]

/**
 * Returns a function for returning a generator
 * based off the given variadic list of code points
 */
export const fromCodePoints = (...points: number[]): ((i: number) => string) =>
	trivialCompose(String.fromCodePoint, fromItems(...points))
