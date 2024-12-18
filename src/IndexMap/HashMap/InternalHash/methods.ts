import {
	MapInternalHash as MapInternalHashClass,
	ObjectInternalHash as ObjectInternalHashClass
} from "./classes.js"

export namespace MapInternalHash {
	export const { prototype } = MapInternalHashClass
	export const { delete: _delete, set, get, replaceKey } = prototype
	export const size = Object.getOwnPropertyDescriptor(prototype, "size")!.get!
}

export namespace ObjectInternalHash {
	export const {
		delete: _delete,
		set,
		get,
		replaceKey
	} = ObjectInternalHashClass.prototype
}
