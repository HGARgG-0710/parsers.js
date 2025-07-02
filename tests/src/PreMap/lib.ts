import { boolean, object, type } from "@hgargg-0710/one"

const { T } = boolean
const { structCheck } = object
const { isFunction, isNumber } = type

export const PreMapInterface = {
	interfaceName: "IPreMap",
	conformance: structCheck({
		set: isFunction,
		delete: isFunction,
		rekey: isFunction,
		size: isNumber,
		default: T,
		copy: isFunction
	})
}
