import type { Pattern } from "../interfaces.js"

export interface Collection<Type = any> extends Pattern, Iterable<Type> {
	push(...x: Type[]): Collection<Type>
}
