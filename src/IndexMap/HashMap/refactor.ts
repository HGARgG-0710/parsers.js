import type { HashClass as HashClassType } from "./interfaces.js"
import type { InternalHash } from "./InternalHash/interfaces.js"

import { HashClass } from "./classes.js"

export function extend<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashClassType<KeyType, ValueType, InternalKeyType>,
	f: (x: any) => KeyType
) {
	return HashClass<any, ValueType, InternalKeyType>(
		(x: any, structure: InternalHash<InternalKeyType, ValueType>) =>
			this.hash(f(x), structure)
	)
}
