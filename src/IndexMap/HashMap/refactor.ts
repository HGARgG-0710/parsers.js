import type { HashClass as HashClassType } from "./interfaces.js"
import { HashClass } from "./classes.js"

export function extend<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashClassType<KeyType, ValueType, InternalKeyType>,
	f: (...x: any[]) => KeyType
) {
	return HashClass<any, ValueType, InternalKeyType>((...x: any[]) => this.hash(f(...x)))
}
