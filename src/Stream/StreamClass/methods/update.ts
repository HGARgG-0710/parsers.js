import type { IStreamClassInstance } from "../interfaces.js"

export function update<Type = any>(this: IStreamClassInstance<Type>) {
	return (this.curr = this.currGetter!())
}
