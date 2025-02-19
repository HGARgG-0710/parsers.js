import type { StreamClassInstance } from "../interfaces.js"

import { object } from "@hgargg-0710/one"
const { GetSetDescriptor } = object.descriptor

function currGet<Type = any>(this: StreamClassInstance<Type>) {
	return this.realCurr
}

export function currSet<Type = any>(this: StreamClassInstance<Type>, value: Type) {
	return (this.realCurr = value)
}

export default GetSetDescriptor(currGet, currSet as () => any)
