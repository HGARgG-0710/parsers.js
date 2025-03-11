import type { EnumSpace } from "./interfaces.js"
import type { Mappable } from "../interfaces.js"

/**
 * Returns a function mapping `enums` using `f`
 */
export const fromEnum =
	<T = any, Type = any>(f: Mappable<T, Type>) =>
	(enums: EnumSpace<T>) =>
		enums.map(f)
