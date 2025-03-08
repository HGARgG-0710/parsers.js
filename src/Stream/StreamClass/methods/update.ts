import type { StreamClassInstance } from "../interfaces.js"

export function update<Type = any>(this: StreamClassInstance<Type>) {
	return (this.curr = this.currGetter!())
}
