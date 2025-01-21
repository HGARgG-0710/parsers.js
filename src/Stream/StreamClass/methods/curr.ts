import type {
	PositionalBufferizedStreamClassInstance,
	StreamClassInstance
} from "../interfaces.js"

import { getSetDescriptor } from "src/refactor.js"
import { readBuffer } from "../refactor.js"

// * possible '.curr=' and '.curr' methods

function set<Type = any>(this: StreamClassInstance<Type>, value: Type) {
	return (this.realCurr = value)
}

function get<Type = any>(this: StreamClassInstance<Type>) {
	return this.realCurr
}

// ! ALSO [later, future release...] - optimize this away [for the 'posBuffer' case - IT MUST be done like 'Object.defineProperty(this, "curr", {get: READ_BUFFER_GETTER, set: set})']
// ? Problem - what about '.unfreeze()' ?! By making an '.unfreeze()', one ALSO
// ^ idea: forbid '.unfreeze()' [remove method], then - split the 'posBufferGets' onto *2* parts [similarly, with 'posBufferNext' - SPLIT IT onto 2 parts... Then, one can save even more repeating code from the 'posBufferNext'];
function posBufferGet<Type = any>(this: PositionalBufferizedStreamClassInstance<Type>) {
	if (this.buffer.isFrozen) return readBuffer(this)
	return get.call(this)
}

const methodList = [
	[set, get],
	[set, posBufferGet]
] as [
	<Type = any>(this: StreamClassInstance<Type>, value: Type) => void,
	<Type = any>(this: StreamClassInstance<Type>) => Type
][]

export function chooseMethod(pos: boolean = false, buffer: boolean = false) {
	return getSetDescriptor(methodList[+(pos && buffer)])
}
