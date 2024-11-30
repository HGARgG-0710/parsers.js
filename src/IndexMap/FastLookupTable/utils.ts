import type { IndexAssignable } from "./interfaces.js"
export const assignIndex = <Type = any>(x: IndexAssignable<Type>, assignedIndex: Type) =>
	(x.assignedIndex = assignedIndex)
