import type { StreamClassInstance } from "../interfaces.js"
import { getSetDescriptor } from "../../../refactor.js"

function currGet<Type = any>(this: StreamClassInstance<Type>) {
	return this.realCurr
}

export function currSet<Type = any>(this: StreamClassInstance<Type>, value: Type) {
	return (this.realCurr = value)
}

export default getSetDescriptor(currGet, currSet as () => any)
