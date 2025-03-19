import type { IEnumSpace } from "./interfaces.js"
import type { IMappable } from "../interfaces.js"

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
export const fromArray =
	<Type = any>(...items: Type[]) =>
	(i: number) =>
		items[i]
