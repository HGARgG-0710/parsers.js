import { TypicalUnfreezable } from "./abstract.js"
import {
	UnfreezableArray as UnfreezableArrayClass,
	UnfreezableString as UnfreezableStringClass
} from "./classes.js"

const { prototype } = TypicalUnfreezable

export const { freeze, unfreeze, read } = prototype
export const size = Object.getOwnPropertyDescriptor(prototype, "size")!.get!

export namespace UnfreezableArray {
	export const { push } = UnfreezableArrayClass.prototype
}

export namespace UnfreezableString {
	export const { push } = UnfreezableStringClass.prototype
}
