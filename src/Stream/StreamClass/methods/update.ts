import type { IStreamClassInstanceImpl } from "../refactor.js"

export function update<Type = any>(this: IStreamClassInstanceImpl<Type>) {
	return (this.curr = this.currGetter!())
}
