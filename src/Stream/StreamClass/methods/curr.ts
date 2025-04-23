import { object } from "@hgargg-0710/one"

const { GetSetDescriptor } = object.descriptor

function currGet<Type = any>(): Type {
	return this.realCurr
}

export function currSet<Type = any>(value: Type): Type {
	return (this.realCurr = value)
}

export default GetSetDescriptor(currGet, currSet)
