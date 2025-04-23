import { HashClass } from "./classes.js"
import type { IHashClass } from "./interfaces.js"

export function extend<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: IHashClass<KeyType, ValueType, InternalKeyType>,
	f: (...x: any[]) => KeyType
) {
	return HashClass<any, ValueType, InternalKeyType>((...x: any[]) =>
		this.hash(f(...x))
	)
}
