import type { StreamClassInstance } from "../interfaces.js"

export interface Updatable<Type = any> {
	update?: () => Type
}

export function update<Type = any>(this: StreamClassInstance<Type>) {
	return (this.curr = this.currGetter!())
}
